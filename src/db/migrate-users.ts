import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(100) UNIQUE NOT NULL,
      full_name VARCHAR(100),
      phone VARCHAR(20),
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
  `);

  console.log("Users migration done!");
  await pool.end();
}

migrate().catch(console.error);
