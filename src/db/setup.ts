/**
 * Railway / fresh DB setup:
 * npx ts-node src/db/setup.ts
 *
 * 1. Schema yaratadi
 * 2. 7 ta muzey qo'shadi
 * 3. Superadmin yaratadi
 */
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

const MUSEUMS = [
  { id: "davlat-sanat",     uz: "O'zbekiston davlat San'at muzeyi",                 ru: "Государственный музей искусств Узбекистана",    region: "Toshkent" },
  { id: "tarix-davlat",     uz: "O'zbekiston tarixi davlat muzeyi",                 ru: "Государственный музей истории Узбекистана",     region: "Toshkent" },
  { id: "temuriylar-tarix", uz: "Temuriylar tarixi davlat muzeyi",                  ru: "Государственный музей истории Тимуридов",       region: "Toshkent" },
  { id: "amaliy-sanat",     uz: "Amaliy san'at va hunarmandchilik muzeyi",          ru: "Музей прикладного искусства и ремёсел",         region: "Toshkent" },
  { id: "tabiat-davlat",    uz: "O'zbekiston davlat tabiat muzeyi",                 ru: "Государственный музей природы Узбекистана",     region: "Toshkent" },
  { id: "olimpiya-shuhrat", uz: "Olimpiya va paralimpiya shon-shuhrati muzeyi",     ru: "Музей олимпийской и паралимпийской славы",      region: "Toshkent" },
  { id: "behzod-miniatura", uz: "Behzod nomidagi Sharq miniatura san'ati muzeyi",  ru: "Музей восточной миниатюры имени Бехзода",       region: "Toshkent" },
];

async function setup() {
  console.log("🔧 Setup boshlandi...\n");

  // 1. Schema
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(sql);
  console.log("✅ Schema yaratildi");

  // 2. Museums
  for (const m of MUSEUMS) {
    await pool.query(
      `INSERT INTO museums (id, region) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [m.id, m.region],
    );
    await pool.query(
      `INSERT INTO museum_translations (museum_id, lang, name) VALUES ($1,'uz',$2) ON CONFLICT (museum_id, lang) DO UPDATE SET name=$2`,
      [m.id, m.uz],
    );
    await pool.query(
      `INSERT INTO museum_translations (museum_id, lang, name) VALUES ($1,'ru',$2) ON CONFLICT (museum_id, lang) DO UPDATE SET name=$2`,
      [m.id, m.ru],
    );
  }
  console.log("✅ 7 ta muzey qo'shildi");

  // 3. Superadmin
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "museum2024";
  const adminName = process.env.ADMIN_FULLNAME || "Museum Shop Admin";
  const hash = await bcrypt.hash(adminPass, 12);
  await pool.query(
    `INSERT INTO admins (username, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'superadmin')
     ON CONFLICT (username) DO UPDATE SET password_hash=$2, role='superadmin'`,
    [adminUser, hash, adminName],
  );
  console.log(`✅ Superadmin yaratildi: ${adminUser} / ${adminPass}`);

  console.log("\n🎉 Setup tugadi!");
  await pool.end();
}

setup().catch((err) => {
  console.error("❌ Setup xatosi:", err.message);
  process.exit(1);
});
