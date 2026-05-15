import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  await pool.query(`
    ALTER TABLE museums ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE museum_translations ADD COLUMN IF NOT EXISTS short TEXT;
    ALTER TABLE museum_translations ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  `);
  console.log("Admin migration done!");
  await pool.end();
}

migrate().catch(console.error);
