import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

const router = Router();

function signToken(id: string, email: string) {
  return jwt.sign({ id, email, type: "user" }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

function requireUser(req: any, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Token kerak" });
  try {
    const payload: any = jwt.verify(auth.slice(7), process.env.JWT_SECRET!);
    if (payload.type !== "user") return res.status(403).json({ error: "Ruxsat yo'q" });
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token yaroqsiz" });
  }
}

// POST /api/users/register
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" });
  if (password.length < 6) return res.status(400).json({ error: "Parol kamida 6 ta belgi" });

  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "INSERT INTO users (email, full_name, password_hash) VALUES ($1,$2,$3) RETURNING id, email, full_name",
      [email.toLowerCase().trim(), fullName || null, hash]
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user.id, user.email), user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Bu email band" });
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/users/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" });

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Email topilmadi" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Parol noto'g'ri" });
    res.json({ token: signToken(user.id, user.email), user: { id: user.id, email: user.email, fullName: user.full_name, phone: user.phone } });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/users/me
router.get("/me", requireUser, async (req: any, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, full_name, phone, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Topilmadi" });
    const u = rows[0];
    res.json({ id: u.id, email: u.email, fullName: u.full_name, phone: u.phone, createdAt: u.created_at });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// PATCH /api/users/me  (profil yangilash)
router.patch("/me", requireUser, async (req: any, res: Response) => {
  const { fullName, phone } = req.body;
  try {
    await pool.query(
      "UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone) WHERE id = $3",
      [fullName || null, phone || null, req.user.id]
    );
    res.json({ message: "Yangilandi" });
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/users/orders  (buyurtmalar tarixi)
router.get("/orders", requireUser, async (req: any, res: Response) => {
  try {
    const { rows: orders } = await pool.query(
      `SELECT id, total_price, status, delivery_method, address, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    const result = await Promise.all(
      orders.map(async (order) => {
        const { rows: items } = await pool.query(
          `SELECT oi.qty, oi.price, p.id AS product_id, pt.name, p.image_url
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.lang = 'uz'
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(result);
  } catch {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/users/orders  (yangi buyurtma)
router.post("/orders", requireUser, async (req: any, res: Response) => {
  const { customerName, customerPhone, deliveryMethod, address, items, totalPrice } = req.body;
  if (!customerPhone || !items?.length) return res.status(400).json({ error: "Ma'lumotlar to'liq emas" });

  try {
    await pool.query("BEGIN");
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, customer_name, customer_phone, delivery_method, address, total_price)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [req.user.id, customerName || null, customerPhone, deliveryMethod || "standard", address || null, totalPrice]
    );
    const orderId = rows[0].id;

    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, qty, price) VALUES ($1,$2,$3,$4)",
        [orderId, item.productId, item.qty, item.price]
      );
    }
    await pool.query("COMMIT");
    res.status(201).json({ orderId });
  } catch {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
