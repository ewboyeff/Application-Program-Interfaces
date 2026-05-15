import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  const username = "admin";
  const password = "museum2024";
  const fullName = "Museum Shop Admin";

  const hash = await bcrypt.hash(password, 12);

  await pool.query(`
    INSERT INTO admins (username, password_hash, full_name, role)
    VALUES ($1, $2, $3, 'superadmin')
    ON CONFLICT (username) DO UPDATE SET password_hash = $2
  `, [username, hash, fullName]);

  const { rows } = await pool.query("SELECT id FROM admins WHERE username = $1", [username]);
  const adminId = rows[0].id;

  // Bot uchun doimiy API token
  const botToken = jwt.sign(
    { id: adminId, username, role: "superadmin" },
    process.env.JWT_SECRET!,
    { expiresIn: "365d" }
  );

  console.log("✅ Admin yaratildi!");
  console.log(`   Login: ${username}`);
  console.log(`   Parol: ${password}`);
  console.log(`\n✅ Bot API Token (bu ni .env ga qo'ying):`);
  console.log(`   BOT_API_TOKEN=${botToken}`);

  await pool.end();
}

seed().catch(console.error);
