import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  await pool.query(`
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
  `);
  console.log("Sellers migration done!");
  await pool.end();
}

migrate().catch(console.error);
