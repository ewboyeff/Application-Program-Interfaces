import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Login va parol kerak" });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );
    const admin = rows[0];
    if (!admin) return res.status(401).json({ error: "Foydalanuvchi topilmadi" });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: "Parol noto'g'ri" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin.id, username: admin.username, fullName: admin.full_name, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/auth/signup — sotuvchi o'z-o'zidan ro'yxatdan o'tadi
router.post("/signup", async (req: Request, res: Response) => {
  const { fullName, username, password, telegramId } = req.body;
  if (!fullName || !username || !password)
    return res.status(400).json({ error: "Ism, login va parol kerak" });
  if (!/^[a-z0-9_]{3,30}$/.test(username))
    return res.status(400).json({ error: "Login faqat kichik lotin harflari, raqam va _ (3-30 belgi)" });
  if (password.length < 6)
    return res.status(400).json({ error: "Parol kamida 6 ta belgi" });

  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO admins (username, password_hash, full_name, role, telegram_id)
       VALUES ($1, $2, $3, 'seller', $4)
       RETURNING id, username, full_name, role`,
      [username, hash, fullName, telegramId || null],
    );
    const seller = rows[0];
    const token = jwt.sign(
      { id: seller.id, username: seller.username, role: seller.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      token,
      admin: { id: seller.id, username: seller.username, fullName: seller.full_name, role: seller.role },
    });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Bu login band, boshqa tanlang" });
    res.status(500).json({ error: "Server xatosi" });
  }
});

// POST /api/auth/register (faqat superadmin qo'sha oladi)
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, fullName, secretKey } = req.body;

  if (secretKey !== process.env.JWT_SECRET + "_admin")
    return res.status(403).json({ error: "Maxfiy kalit noto'g'ri" });

  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "INSERT INTO admins (username, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, username, full_name",
      [username, hash, fullName]
    );
    res.status(201).json({ admin: rows[0] });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Bu login band" });
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
