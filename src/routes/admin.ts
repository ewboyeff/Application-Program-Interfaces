import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db/pool";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

const storage = multer.diskStorage({
  destination: process.env.UPLOAD_DIR || "./uploads",
  filename: (_, file, cb) => {
    cb(null, `museum-${uuidv4()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Faqat rasm"));
  },
});

// GET /api/admin/stats
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  try {
    const [products, museums, users, orders, pendingOrders] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM products WHERE in_stock = TRUE"),
      pool.query("SELECT COUNT(*) FROM museums"),
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM orders"),
      pool.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'"),
    ]);
    res.json({
      products: parseInt(products.rows[0].count),
      museums: parseInt(museums.rows[0].count),
      users: parseInt(users.rows[0].count),
      orders: parseInt(orders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
    });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/admin/orders
router.get("/orders", async (req: AuthRequest, res: Response) => {
  const { status, page = "1", limit = "25" } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  try {
    let q = `
      SELECT o.id, o.customer_name, o.customer_phone, o.delivery_method,
             o.address, o.total_price, o.status, o.created_at,
             u.email AS user_email, u.full_name AS user_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { params.push(status); q += ` AND o.status = $${params.length}`; }
    q += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const { rows: orders } = await pool.query(q, params);

    const withItems = await Promise.all(
      orders.map(async (order) => {
        const { rows: items } = await pool.query(
          `SELECT oi.qty, oi.price, p.id AS product_id, pt.name AS product_name, p.image_url
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.lang = 'uz'
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    let countQ = `SELECT COUNT(*) FROM orders WHERE 1=1`;
    const countParams: any[] = [];
    if (status) { countParams.push(status); countQ += ` AND status = $${countParams.length}`; }
    const { rows: countRows } = await pool.query(countQ, countParams);

    res.json({ orders: withItems, total: parseInt(countRows[0].count) });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch("/orders/:id/status", async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const valid = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!valid.includes(status)) return res.status(400).json({ error: "Noto'g'ri status" });
  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id",
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Topilmadi" });
    res.json({ message: "Status yangilandi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/admin/users
router.get("/users", async (req: AuthRequest, res: Response) => {
  const { page = "1", limit = "25", search } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  try {
    let q = `
      SELECT u.id, u.email, u.full_name, u.phone, u.created_at,
             COUNT(o.id)::int AS order_count
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (search) { params.push(`%${search}%`); q += ` AND (u.email ILIKE $${params.length} OR u.full_name ILIKE $${params.length})`; }
    q += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const { rows } = await pool.query(q, params);

    let countQ = "SELECT COUNT(*) FROM users WHERE 1=1";
    const countParams: any[] = [];
    if (search) { countParams.push(`%${search}%`); countQ += ` AND (email ILIKE $${countParams.length} OR full_name ILIKE $${countParams.length})`; }
    const { rows: countRows } = await pool.query(countQ, countParams);

    res.json({ users: rows, total: parseInt(countRows[0].count) });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/admin/museums
router.get("/museums", async (_req: AuthRequest, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.id, m.region, m.image_url,
             json_object_agg(mt.lang, json_build_object(
               'name', mt.name, 'city', mt.city, 'short', mt.short
             )) AS translations
      FROM museums m
      LEFT JOIN museum_translations mt ON mt.museum_id = m.id
      GROUP BY m.id
      ORDER BY m.id
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/admin/museums
router.post("/museums", upload.single("image"), async (req: AuthRequest, res: Response) => {
  const { id, region, name_uz, city_uz, short_uz, name_ru, city_ru, name_en, city_en } = req.body;
  if (!id || !name_uz) return res.status(400).json({ error: "ID va muzey nomi (uz) kerak" });
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await pool.query("BEGIN");
    await pool.query("INSERT INTO museums (id, region, image_url) VALUES ($1,$2,$3)", [id, region || null, imageUrl]);
    const langs = [
      { lang: "uz", name: name_uz, city: city_uz, short: short_uz },
      { lang: "ru", name: name_ru || name_uz, city: city_ru || city_uz, short: null },
      { lang: "en", name: name_en || name_uz, city: city_en || city_uz, short: null },
    ];
    for (const l of langs) {
      await pool.query(
        "INSERT INTO museum_translations (museum_id, lang, name, city, short) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
        [id, l.lang, l.name || null, l.city || null, l.short || null]
      );
    }
    await pool.query("COMMIT");
    res.status(201).json({ id, message: "Muzey qo'shildi" });
  } catch (err: any) {
    await pool.query("ROLLBACK");
    if (err.code === "23505") return res.status(409).json({ error: "Bu ID band" });
    res.status(500).json({ error: "Server xatosi" });
  }
});

// PUT /api/admin/museums/:id
router.put("/museums/:id", upload.single("image"), async (req: AuthRequest, res: Response) => {
  const { region, name_uz, city_uz, short_uz, name_ru, city_ru, name_en, city_en } = req.body;
  try {
    const updates: string[] = [];
    const vals: any[] = [];
    if (region !== undefined) { vals.push(region); updates.push(`region = $${vals.length}`); }
    if (req.file) { vals.push(`/uploads/${req.file.filename}`); updates.push(`image_url = $${vals.length}`); }
    if (updates.length) {
      vals.push(req.params.id);
      await pool.query(`UPDATE museums SET ${updates.join(", ")} WHERE id = $${vals.length}`, vals);
    }
    const langs = [
      { lang: "uz", name: name_uz, city: city_uz, short: short_uz },
      { lang: "ru", name: name_ru, city: city_ru },
      { lang: "en", name: name_en, city: city_en },
    ];
    for (const l of langs) {
      if (!l.name) continue;
      await pool.query(
        `INSERT INTO museum_translations (museum_id, lang, name, city, short)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (museum_id, lang) DO UPDATE SET name=$3, city=$4, short=$5`,
        [req.params.id, l.lang, l.name, l.city || null, (l as any).short || null]
      );
    }
    res.json({ message: "Yangilandi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// DELETE /api/admin/museums/:id
router.delete("/museums/:id", async (req: AuthRequest, res: Response) => {
  try {
    await pool.query("DELETE FROM museum_translations WHERE museum_id = $1", [req.params.id]);
    await pool.query("DELETE FROM museums WHERE id = $1", [req.params.id]);
    res.json({ message: "O'chirildi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/admin/products (barcha mahsulotlar, arxivlanganlar ham)
router.get("/products", async (req: AuthRequest, res: Response) => {
  const { page = "1", limit = "50", type, search, stock } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  try {
    let q = `
      SELECT p.id, p.type, p.category, p.price, p.image_url, p.museum_id,
             p.in_stock, p.created_at,
             t.name, t.short,
             m.name AS museum_name
      FROM products p
      LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang = 'uz'
      LEFT JOIN museum_translations m ON m.museum_id = p.museum_id AND m.lang = 'uz'
      WHERE 1=1
    `;
    const params: any[] = [];
    if (type) { params.push(type); q += ` AND p.type = $${params.length}`; }
    if (stock === "true") q += ` AND p.in_stock = TRUE`;
    if (stock === "false") q += ` AND p.in_stock = FALSE`;
    if (search) { params.push(`%${search}%`); q += ` AND t.name ILIKE $${params.length}`; }
    q += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const { rows } = await pool.query(q, params);

    let cq = `SELECT COUNT(*) FROM products p LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang='uz' WHERE 1=1`;
    const cp: any[] = [];
    if (type) { cp.push(type); cq += ` AND p.type = $${cp.length}`; }
    if (stock === "true") cq += ` AND p.in_stock = TRUE`;
    if (stock === "false") cq += ` AND p.in_stock = FALSE`;
    if (search) { cp.push(`%${search}%`); cq += ` AND t.name ILIKE $${cp.length}`; }
    const { rows: cr } = await pool.query(cq, cp);

    res.json({ products: rows, total: parseInt(cr[0].count) });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
