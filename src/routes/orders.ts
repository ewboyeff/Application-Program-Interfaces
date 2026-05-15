import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

const router = Router();

// POST /api/orders — kirmasdan ham buyurtma berish
router.post("/", async (req: Request, res: Response) => {
  const { customerName, customerPhone, deliveryMethod, address, items, totalPrice } = req.body;

  if (!customerPhone) return res.status(400).json({ error: "Telefon raqam kerak" });
  if (!items?.length) return res.status(400).json({ error: "Savat bo'sh" });

  // Agar token bo'lsa, user_id ni ulab qo'yamiz
  let userId: string | null = null;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      const payload: any = jwt.verify(auth.slice(7), process.env.JWT_SECRET!);
      if (payload.type === "user") userId = payload.id;
    } catch {}
  }

  try {
    await pool.query("BEGIN");
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, customer_name, customer_phone, delivery_method, address, total_price)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [userId, customerName || null, customerPhone, deliveryMethod || "standard", address || null, totalPrice]
    );
    const orderId = rows[0].id;

    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, qty, price) VALUES ($1,$2,$3,$4)",
        [orderId, item.productId, item.qty, item.price]
      );
    }
    await pool.query("COMMIT");
    res.status(201).json({ orderId, message: "Buyurtma qabul qilindi" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
