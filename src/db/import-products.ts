import { pool } from "./pool";
import dotenv from "dotenv";
dotenv.config();

const MUSEUM_ID = "history-uz";
const ADMIN_ID  = "15f96e2f-5113-4381-b68b-1f6ca89ed522";

function img(n: number) {
  return `/uploads/hist-${String(n).padStart(3, "0")}.${n >= 48 && n <= 56 ? "png" : n === 61 ? "jpg" : "jpeg"}`;
}

const PRODUCTS = [
  // ── MUZEY SUVENIRLARI ── replika (10) ─────────────────────────────────
  {
    id: "hist-quyosh-hudosi",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(1),
    name: "Quyosh hudosi (ramkada)", dims: "12,5×18×2,5 sm",
    short: "I–II asrga tegishli ashyo replikasi. Sopol, ramkada.",
  },
  {
    id: "hist-ikki-ilon-haykalcha",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(2),
    name: "Ikki ilon tasviri — haykalcha",dims: "8×7×1,8 sm",
    short: "Bronza davriga oid ashyo replikasi. Gips, bo'yoq.",
  },
  {
    id: "hist-ikki-ilon-tashrif",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(3),
    name: "Ikki ilon — tashrif qog'ozlar uchun",dims: "8×7×2,5 sm",
    short: "Bronza davriga oid ashyo replikasi. Tashrif qog'ozlari uchun.",
  },
  {
    id: "hist-qoplama-koshin-olti",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(4),
    name: "Qoplama koshin (olti qirrali)",dims: "16×12 sm",
    short: "Samarqand. XIV–XV asr ashyo replikasi. Sopol, sirlangan.",
  },
  {
    id: "hist-siyohdon",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(5),
    name: "Siyohdon — islimiy naqshlar",dims: "Balandligi 7,6 sm",
    short: "Islimiy naqshlar bilan bezatilgan siyohdon replikasi. Sopol, sirlangan.",
  },
  {
    id: "hist-moychiroq",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(6),
    name: "Moychiroq", dims: "Balandligi 5 sm, kengligi 13 sm",
    short: "Toshkent. XI–XII asr ashyo replikasi.",
  },
  {
    id: "hist-tarelka-1",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(7),
    name: "Tarelka — lagan replikasi I",dims: "Ø15 sm, balandligi 4 sm",
    short: "X–XII asr lagan replikasi. Sopol, sirlangan.",
  },
  {
    id: "hist-tarelka-2",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(8),
    name: "Tarelka — lagan replikasi II",dims: "Ø15 sm, balandligi 4 sm",
    short: "X–XII asr lagan replikasi. Sopol, sirlangan.",
  },
  {
    id: "hist-qoplama-chavandoz",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(10),
    name: "Qoplama koshin — chavandoz",dims: "10×10 sm",
    short: "Samarqand. XVI asr ashyo replikasi. Sopol, sirlangan.",
  },
  {
    id: "hist-kushon-shaxzoda",
    type: "MUZEY_SUVENIRLARI", category: "Muzey ashyolari replikalari",
    price: 60000, img: img(11),
    name: "Kushon shaxzodasi boshi",dims: "Balandligi 10 sm, kengligi 4 sm",
    short: "I asr ashyo replikasi. Gips, bo'yoq.",
  },

  // ── MUZEY SUVENIRLARI ── bolalar (2) ──────────────────────────────────
  {
    id: "hist-puzzle-afrosiyob",
    type: "MUZEY_SUVENIRLARI", category: "Bolalar uchun",
    price: 40000, img: img(12),
    name: "Puzzle — Afrosiyob saroyi",dims: null,
    short: "Afrosiyob saroyi devoriy suratidan parcha. Bolalar uchun.",
  },
  {
    id: "hist-puzzle-chavandoz",
    type: "MUZEY_SUVENIRLARI", category: "Bolalar uchun",
    price: 40000, img: img(13),
    name: "Puzzle — chavandoz",dims: null,
    short: "Kompozitsiyali qoplama koshin (chavandoz) tasviri. Bolalar uchun.",
  },

  // ── MUZEY SUVENIRLARI ── otkritkalar (16) ─────────────────────────────
  {
    id: "hist-otk-kozgu-tognogich", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(14),
    name: "Otkritka — Ko'zgu va to'g'nog'ich",dims: null,
    short: "Sopollitepa, Surxondaryo. Bronza. Er.av. XVII–XV asrlar.",
  },
  {
    id: "hist-otk-doppilar", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(15),
    name: "Otkritka — Do'ppilar",dims: null,
    short: "XX asr. Farg'ona, Buxoro. Satin, baxmal, ipak.",
  },
  {
    id: "hist-otk-idish-v-ming", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(16),
    name: "Otkritka — Idish (er.av. V ming yillik)",dims: null,
    short: "Er.avv. V ming yillik. Sopol. Navoiy viloyati.",
  },
  {
    id: "hist-otk-idish-sopollitepa", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(17),
    name: "Otkritka — Idishlar Sopollitepa",dims: null,
    short: "Sopollitepa, Surxondaryo. Er.av. XVII–XV asrlar.",
  },
  {
    id: "hist-otk-mehnat-qurol", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(18),
    name: "Otkritka — Mehnat qurollari",dims: null,
    short: "Ko'lbuloq manzilgohi. Mill.avv. 650 ming yillik. Toshkent viloyati.",
  },
  {
    id: "hist-otk-xanjar", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(19),
    name: "Otkritka — XIX asr xanjari",dims: null,
    short: "Buxoro. Kumush, o'ymakorli, inkrustatsiya.",
  },
  {
    id: "hist-otk-ayol-ziynati", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(20),
    name: "Otkritka — Ayollar zeb-ziynati",dims: null,
    short: "XIX asr. Xiva. O'ymakorlik, kumush, korallar, feruza.",
  },
  {
    id: "hist-otk-choynak", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(21),
    name: "Otkritka — Kumush choynak",dims: null,
    short: "XIX asrning 2-yarmi. Qo'qon. Kumush, kandakorlik.",
  },
  {
    id: "hist-otk-belbog", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(22),
    name: "Otkritka — Erkaklar belbog'i",dims: null,
    short: "XIX asr. Buxoro. Baxmal, zardo'zi va kumush, ipak.",
  },
  {
    id: "hist-otk-kovush", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(23),
    name: "Otkritka — Erkaklar kovushi",dims: null,
    short: "Buxoro. Baxmal, zardo'zi.",
  },
  {
    id: "hist-otk-budda", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(24),
    name: "Otkritka — Budda rohiblar bilan",dims: null,
    short: "Er. I–II asr. Fayoztepa, Surxondaryo. Ohak, o'yma.",
  },
  {
    id: "hist-otk-kozgu-kumush", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(25),
    name: "Otkritka — Ko'zgu (kumush)",dims: null,
    short: "Er.av. II–I asrlar. Ko'ktepa, Samarqand. Kumush, quyma.",
  },
  {
    id: "hist-otk-sanskrit", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(26),
    name: "Otkritka — Sanskrit yozuvi",dims: null,
    short: "VI–VII asrlar. Zangtepa, Surxondaryo. Beresta.",
  },
  {
    id: "hist-otk-idish-shisha", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(27),
    name: "Otkritka — Shisha idish",dims: null,
    short: "XX–XII asrlar. Shisha.",
  },
  {
    id: "hist-otk-tosh-tumor", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(28),
    name: "Otkritka — Tosh tumor",dims: null,
    short: "Er.av. II ming yillik. So'x, Farg'ona viloyati.",
  },
  {
    id: "hist-otk-makedonskiy", type: "MUZEY_SUVENIRLARI", category: "Otkritkalar",
    price: 1500, img: img(29),
    name: "Otkritka — Aleksandr tanga",dims: null,
    short: "Aleksandr Makedonskiyga oid tanga. Er.av. IV asr.",
  },

  // ── MOHIR QO'LLAR ─────────────────────────────────────────────────────
  {
    id: "hist-futbolka-baxmal-1", type: "MOHIR_QOLLAR", category: "Kiyimlar",
    price: 230000, img: img(30),
    name: "Futbolka — baxmal bezakli I",dims: null,
    short: "Muzey mavzusidagi baxmal bezakli futbolka.",
  },
  {
    id: "hist-futbolka-baxmal-2", type: "MOHIR_QOLLAR", category: "Kiyimlar",
    price: 230000, img: img(31),
    name: "Futbolka — baxmal bezakli II",dims: null,
    short: "Muzey mavzusidagi baxmal bezakli futbolka.",
  },
  {
    id: "hist-futbolka-dtf-1", type: "MOHIR_QOLLAR", category: "Kiyimlar",
    price: 95000, img: img(32),
    name: "Futbolka — DTF bosma I",dims: null,
    short: "DTF bosma printli futbolka.",
  },
  {
    id: "hist-futbolka-dtf-2", type: "MOHIR_QOLLAR", category: "Kiyimlar",
    price: 95000, img: img(33),
    name: "Futbolka — DTF bosma II",dims: null,
    short: "DTF bosma printli futbolka.",
  },
  {
    id: "hist-futbolka-dtf-3", type: "MOHIR_QOLLAR", category: "Kiyimlar",
    price: 95000, img: img(34),
    name: "Futbolka — DTF bosma III",dims: null,
    short: "DTF bosma printli futbolka.",
  },
  {
    id: "hist-shopper-150-1", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 150000, img: img(35),
    name: "Shopper I",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-150-2", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 150000, img: img(36),
    name: "Shopper II",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-95-1", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 95000, img: img(37),
    name: "Shopper III",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-95-2", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 95000, img: img(38),
    name: "Shopper IV",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-95-3", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 95000, img: img(39),
    name: "Shopper V",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-150-3", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 150000, img: img(40),
    name: "Shopper VI",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-shopper-150-4", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 150000, img: img(41),
    name: "Shopper VII",dims: null,
    short: "Muzey mavzusidagi shopper.",
  },
  {
    id: "hist-romolcha-1", type: "MOHIR_QOLLAR", category: "Matolar",
    price: 180000, img: img(42),
    name: "Ro'molcha I",dims: null,
    short: "Muzey mavzusidagi ro'molcha.",
  },
  {
    id: "hist-romolcha-2", type: "MOHIR_QOLLAR", category: "Matolar",
    price: 180000, img: img(43),
    name: "Ro'molcha II",dims: null,
    short: "Muzey mavzusidagi ro'molcha.",
  },
  {
    id: "hist-romolcha-3", type: "MOHIR_QOLLAR", category: "Matolar",
    price: 180000, img: img(44),
    name: "Ro'molcha III",dims: null,
    short: "Muzey mavzusidagi ro'molcha.",
  },
  {
    id: "hist-romolcha-4", type: "MOHIR_QOLLAR", category: "Matolar",
    price: 180000, img: img(45),
    name: "Ro'molcha IV",dims: null,
    short: "Muzey mavzusidagi ro'molcha.",
  },
  {
    id: "hist-kitob-en", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 35000, img: img(46),
    name: "Kitob — Yo'lko'rsatkich (ingliz)",dims: null,
    short: "O'zbekiston tarixi davlat muzeyi yo'lko'rsatkich kitobi (ingliz tilida).",
  },
  {
    id: "hist-kitob-uz", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 35000, img: img(47),
    name: "Kitob — Yo'lko'rsatkich (o'zbek)",dims: null,
    short: "O'zbekiston tarixi davlat muzeyi yo'lko'rsatkich kitobi (o'zbek tilida).",
  },
  {
    id: "hist-kitob-ru", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 35000, img: img(48),
    name: "Kitob — Yo'lko'rsatkich (rus)",dims: null,
    short: "O'zbekiston tarixi davlat muzeyi yo'lko'rsatkich kitobi (rus tilida).",
  },
  {
    id: "hist-sarhun-1", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(49),
    name: "Sarhun (krujka) I",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-2", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(50),
    name: "Sarhun (krujka) II",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-3", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(51),
    name: "Sarhun (krujka) III",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-4", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(52),
    name: "Sarhun (krujka) IV",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-5", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(53),
    name: "Sarhun (krujka) V",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-6", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(54),
    name: "Sarhun (krujka) VI",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-7", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(55),
    name: "Sarhun (krujka) VII",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-8", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(56),
    name: "Sarhun (krujka) VIII",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-9", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 50000, img: img(57),
    name: "Sarhun (krujka) IX",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-sarhun-10", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 45000, img: img(58),
    name: "Sarhun (krujka) X",dims: null,
    short: "Muzey mavzusidagi bosma printli krujka.",
  },
  {
    id: "hist-otk-toplami-zargarlik", type: "MOHIR_QOLLAR", category: "Shopperlar",
    price: 45000, img: img(59),
    name: "Otkritkalar to'plami — zargarlik",dims: null,
    short: "Zargarlik buyumlari mavzusidagi otkritkalar to'plami.",
  },
  {
    id: "hist-termos-1", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 85000, img: img(60),
    name: "Termos I",dims: null,
    short: "Muzey mavzusidagi bosma printli termos.",
  },
  {
    id: "hist-termos-2", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 85000, img: img(61),
    name: "Termos II",dims: null,
    short: "Muzey mavzusidagi bosma printli termos.",
  },
  {
    id: "hist-termos-3", type: "MOHIR_QOLLAR", category: "Bosma printli idishlar",
    price: 85000, img: img(61),
    name: "Termos III",dims: null,
    short: "Muzey mavzusidagi bosma printli termos.",
  },
];

async function run() {
  let added = 0;
  for (const p of PRODUCTS) {
    try {
      await pool.query("BEGIN");
      await pool.query(
        `INSERT INTO products (id, type, category, price, image_url, museum_id, dimensions, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.type, p.category, p.price, p.img, MUSEUM_ID, p.dims, ADMIN_ID]
      );
      await pool.query(
        `INSERT INTO product_translations (product_id, lang, name, short, description)
         VALUES ($1,'uz',$2,$3,$3)
         ON CONFLICT (product_id, lang) DO NOTHING`,
        [p.id, p.name, p.short]
      );
      await pool.query("COMMIT");
      added++;
      process.stdout.write(`\r${added}/${PRODUCTS.length} — ${p.name.slice(0, 40)}`);
    } catch (err: any) {
      await pool.query("ROLLBACK");
      console.error(`\nXatolik [${p.id}]:`, err.message);
    }
  }
  console.log(`\n\nJami ${added} ta mahsulot qo'shildi!`);
  await pool.end();
}

run().catch(console.error);
