import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

async function seedMuseums() {
  await pool.query(`
    INSERT INTO museums (id, region) VALUES
      ('amir-temur', 'Toshkent'),
      ('history-uz', 'Toshkent'),
      ('savitsky', 'Qoraqalpogiston'),
      ('bukhara-ark', 'Buxoro')
    ON CONFLICT (id) DO NOTHING
  `);

  await pool.query(`
    INSERT INTO museum_translations (museum_id, lang, name, city) VALUES
      ('amir-temur', 'uz', 'Amir Temur muzeyi', 'Toshkent'),
      ('amir-temur', 'ru', 'Muzey Amira Temura', 'Toshkent'),
      ('amir-temur', 'en', 'Amir Temur Museum', 'Tashkent'),
      ('history-uz', 'uz', 'O''zbekiston Tarixi Davlat muzeyi', 'Toshkent'),
      ('history-uz', 'ru', 'Gosudarstvennyy muzey istorii Uzbekistana', 'Toshkent'),
      ('history-uz', 'en', 'State Museum of History of Uzbekistan', 'Tashkent'),
      ('savitsky', 'uz', 'Savitskiy muzeyi', 'Nukus'),
      ('savitsky', 'ru', 'Muzey Savitskogo', 'Nukus'),
      ('savitsky', 'en', 'Savitsky Museum', 'Nukus'),
      ('bukhara-ark', 'uz', 'Buxoro Ark qalasi', 'Buxoro'),
      ('bukhara-ark', 'ru', 'Buxarskaya krepost Ark', 'Buxoro'),
      ('bukhara-ark', 'en', 'Bukhara Ark Fortress', 'Bukhara')
    ON CONFLICT (museum_id, lang) DO NOTHING
  `);

  console.log("Muzeylar qo'shildi!");
  await pool.end();
}

seedMuseums().catch(console.error);
