import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db/pool";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: process.env.UPLOAD_DIR || "./uploads",
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Faqat rasm fayllari qabul qilinadi"));
  },
});

// GET /api/products — barcha mahsulotlar (public)
router.get("/", async (req: Request, res: Response) => {
  const { type, museum_id, lang = "uz" } = req.query;
  try {
    let q = `
      SELECT p.*, t.name, t.short, t.description,
             m_uz.name AS museum_name
      FROM products p
      LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang = $1
      LEFT JOIN museum_translations m_uz ON m_uz.museum_id = p.museum_id AND m_uz.lang = $1
      WHERE p.in_stock = TRUE
    `;
    const params: any[] = [lang];

    if (type) { params.push(type); q += ` AND p.type = $${params.length}`; }
    if (museum_id) { params.push(museum_id); q += ` AND p.museum_id = $${params.length}`; }

    q += " ORDER BY p.created_at DESC";
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/products/:id — bitta mahsulot (public)
router.get("/:id", async (req: Request, res: Response) => {
  const { lang = "uz" } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT p.*, t.name, t.short, t.description
       FROM products p
       LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang = $1
       WHERE p.id = $2`,
      [lang, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/products — yangi mahsulot qo'shish (admin)
router.post("/", requireAuth, upload.single("image"), async (req: AuthRequest, res: Response) => {
  const { type, category, price, museum_id, maker, dimensions, name_uz, short_uz, desc_uz } = req.body;

  if (!req.file) return res.status(400).json({ error: "Rasm yuklanmadi" });
  if (!type || !category || !price || !name_uz)
    return res.status(400).json({ error: "Majburiy maydonlar to'ldirilmagan" });

  const id = name_uz.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + uuidv4().slice(0, 6);
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    await pool.query("BEGIN");

    await pool.query(
      `INSERT INTO products (id, type, category, price, image_url, museum_id, maker, dimensions, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, type, category, parseInt(price), imageUrl, museum_id || null, maker || null, dimensions || null, req.admin!.id]
    );

    await pool.query(
      `INSERT INTO product_translations (product_id, lang, name, short, description)
       VALUES ($1,'uz',$2,$3,$4)`,
      [id, name_uz, short_uz || "", desc_uz || ""]
    );

    await pool.query("COMMIT");
    res.status(201).json({ id, imageUrl, message: "Mahsulot qo'shildi" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Server xatosi" });
  }
});

// PUT /api/products/:id — mahsulotni tahrirlash (admin)
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { price, in_stock, name_uz, short_uz, desc_uz } = req.body;
  try {
    if (price !== undefined || in_stock !== undefined) {
      const updates: string[] = [];
      const vals: any[] = [];
      if (price !== undefined) { vals.push(parseInt(price)); updates.push(`price = $${vals.length}`); }
      if (in_stock !== undefined) { vals.push(in_stock); updates.push(`in_stock = $${vals.length}`); }
      vals.push(req.params.id);
      await pool.query(`UPDATE products SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${vals.length}`, vals);
    }
    if (name_uz) {
      await pool.query(
        `INSERT INTO product_translations (product_id, lang, name, short, description)
         VALUES ($1,'uz',$2,$3,$4)
         ON CONFLICT (product_id, lang) DO UPDATE SET name=$2, short=$3, description=$4`,
        [req.params.id, name_uz, short_uz || "", desc_uz || ""]
      );
    }
    res.json({ message: "Yangilandi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query("UPDATE products SET in_stock = FALSE WHERE id = $1", [req.params.id]);
    res.json({ message: "Mahsulot arxivlandi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
