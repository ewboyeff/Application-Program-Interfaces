import rishton from "@/assets/col-rishton.jpg";
import samarkand from "@/assets/col-samarkand.jpg";
import bukhara from "@/assets/col-bukhara.jpg";
import figurines from "@/assets/col-figurines.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type MainType = "MOHIR_QOLLAR" | "MUZEY_SUVENIRLARI";

export type MohirSubcat =
  | "Zargarlik buyumlari"
  | "Sopol buyumlar"
  | "Bosma printli idishlar"
  | "Kiyimlar"
  | "Shopperlar"
  | "Yog'och o'ymakorligi"
  | "Gilamalar"
  | "Matolar"
  | "Kashtachilik"
  | "Miniatyuralar";

export type MuzeySubcat =
  | "Kitoblar va kataloglar"
  | "Bolalar uchun"
  | "Bosma printli idishlar (muzey)"
  | "Bosma printli kiyimlar"
  | "Shopperlar (muzey)"
  | "Otkritkalar"
  | "Breloklar va magnitlar"
  | "Muzey ashyolari replikalari";

export type Category = MohirSubcat | MuzeySubcat;

export const MOHIR_SUBCATS: MohirSubcat[] = [
  "Zargarlik buyumlari",
  "Sopol buyumlar",
  "Bosma printli idishlar",
  "Kiyimlar",
  "Shopperlar",
  "Yog'och o'ymakorligi",
  "Gilamalar",
  "Matolar",
  "Kashtachilik",
  "Miniatyuralar",
];

export const MUZEY_SUBCATS: MuzeySubcat[] = [
  "Kitoblar va kataloglar",
  "Bolalar uchun",
  "Bosma printli idishlar (muzey)",
  "Bosma printli kiyimlar",
  "Shopperlar (muzey)",
  "Otkritkalar",
  "Breloklar va magnitlar",
  "Muzey ashyolari replikalari",
];

export type Product = {
  id: string;
  name: string;
  type: MainType;
  category: Category;
  price: number; // in so'm
  image: string;
  museum: string;
  museumId: string;
  maker?: string;
  dimensions?: string;
  short: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "rishton-lagan",
    name: "Rishton ko'k lagan",
    type: "MOHIR_QOLLAR",
    category: "Sopol buyumlar",
    price: 420000,
    image: rishton,
    museum: "Rishton State Museum",
    museumId: "savitsky",
    maker: "Rustam Umarov",
    dimensions: "Ø 32 sm, chuqurligi 5 sm",
    short: "Feruza va ko'k naqshlardagi an'anaviy lagan — qo'lda chizilgan.",
    description:
      "Rishton shahridagi mashhur ustalar tomonidan an'anaviy ishqor sirlash usulida tayyorlangan. Har bir lagan unikal — qadimgi muzey eksponati nusxasi asosida 14 kun davomida qo'lda bezatiladi.",
  },
  {
    id: "samarkand-kosa",
    name: "Samarqand naqshli kosa",
    type: "MUZEY_SUVENIRLARI",
    category: "Muzey ashyolari replikalari",
    price: 560000,
    image: samarkand,
    museum: "Afrosiyob Museum",
    museumId: "amir-temur",
    maker: "Muzey ustaxonasi",
    dimensions: "Ø 18 sm, balandligi 9 sm",
    short: "XV asr saroy idishlaridan ilhomlangan oltin va lojuvard kosa.",
    description:
      "Amir Temur saroyidagi keramika asosida zamonaviy ustalar tomonidan tiklangan. Qo'lda yasalgan, yuqori haroratda kuydirilgan va 24 karat oltin ramz bilan bezatilgan.",
  },
  {
    id: "bukhara-marjon",
    name: "Buxoro filigran marjoni",
    type: "MOHIR_QOLLAR",
    category: "Zargarlik buyumlari",
    price: 1800000,
    image: bukhara,
    museum: "Bukhara Ark Museum",
    museumId: "bukhara-ark",
    maker: "Abdulloh Nazarov",
    dimensions: "Uzunligi 45 sm",
    short: "Kumush filigran, qizil agat va feruza — amir saroyi xazinasidan.",
    description:
      "925-shoyi kumush, qizil agat va Nishopur feruzasidan tayyorlangan. XIX asr Buxoro amiri sarayidagi marjon nusxasi — har bir buyum sertifikatlangan.",
  },
  {
    id: "bronza-chavandoz",
    name: "Bronza chavandoz haykalcha",
    type: "MUZEY_SUVENIRLARI",
    category: "Muzey ashyolari replikalari",
    price: 920000,
    image: figurines,
    museum: "Amir Temur Museum",
    museumId: "amir-temur",
    maker: "Muzey ustaxonasi",
    dimensions: "Balandligi 22 sm, granit poydevor",
    short: "Buyuk Ipak yo'li jangchisining bronza siymolari.",
    description:
      "Termiz arxeologik muzeyidagi I asr bronza haykalining miniaturasi. Qo'lda quyilgan, antik patina effektida yakunlangan, granit poydevor bilan keladi.",
  },
  {
    id: "kok-choynak",
    name: "Ko'k naqshli choynak",
    type: "MOHIR_QOLLAR",
    category: "Sopol buyumlar",
    price: 320000,
    image: p1,
    museum: "State Museum of History",
    museumId: "history-uz",
    maker: "Sardor Toshmatov",
    dimensions: "Balandligi 18 sm, hajmi 0.8 l",
    short: "Qo'lda chizilgan klassik Rishton uslubidagi mayda choynak.",
    description:
      "Sof ozodalik va an'analar uyg'unligi. Choyxona uchun ideal — issiq saqlash va beshikni ko'tarib turuvchi mustahkam tutqich bilan.",
  },
  {
    id: "ipak-ikat",
    name: "Ipak ikat ro'mol",
    type: "MOHIR_QOLLAR",
    category: "Matolar",
    price: 540000,
    image: p2,
    museum: "Savitsky Museum",
    museumId: "savitsky",
    maker: "Dilnoza Yusupova",
    dimensions: "140 × 140 sm",
    short: "Marg'ilon ustalari tomonidan an'anaviy abr-bandi usulida to'qilgan.",
    description:
      "100% tabiiy tut ipagi. Ranglar tabiiy bo'yoqlardan — anor po'sti, ko'k indigo, oltin qabuq. Har bir ro'mol uch usta nazoratida 21 kun mehnat mahsulidir.",
  },
  {
    id: "lauh",
    name: "Yog'och lauh kitobligi",
    type: "MOHIR_QOLLAR",
    category: "Yog'och o'ymakorligi",
    price: 780000,
    image: p3,
    museum: "State Museum of History",
    museumId: "history-uz",
    maker: "Xurshid Qodirov",
    dimensions: "35 × 25 sm, qalinligi 3 sm",
    short: "Xivada qo'lda o'yilgan, an'anaviy o'simlik motivlari bilan.",
    description:
      "Tut yog'ochidan, bir bo'lakdan o'yilgan. An'anaviy islimi naqshlar bilan bezatilgan, mum bilan pardozlangan. Quron yoki katta kitob uchun mukammal.",
  },
  {
    id: "suzani",
    name: "Suzani gilam panel",
    type: "MOHIR_QOLLAR",
    category: "Kashtachilik",
    price: 1200000,
    image: p4,
    museum: "Bukhara Ark Museum",
    museumId: "bukhara-ark",
    maker: "Mohlaroyim Rahimova",
    dimensions: "120 × 80 sm",
    short: "Qizil va oltin ranglardagi an'anaviy suzani — devor uchun.",
    description:
      "Buxoro ayollari tomonidan qo'lda kashtalangan. Anor, gul va quyosh ramzlari bilan bezatilgan — uy, sevgi va baraka uchun an'anaviy in'om.",
  },
  {
    id: "yog-chiroq",
    name: "Bronza yog' chiroq",
    type: "MUZEY_SUVENIRLARI",
    category: "Muzey ashyolari replikalari",
    price: 740000,
    image: p5,
    museum: "State Museum of History",
    museumId: "history-uz",
    maker: "Muzey ustaxonasi",
    dimensions: "Balandligi 16 sm, diametri 12 sm",
    short: "X asr yog' chirog'i — antik bronza patinasi bilan.",
    description:
      "Qadimda Buxoro karvonsaroylarida ishlatilgan chiroq nusxasi. Qo'lda quyilgan bronza, sirpanma poydevor, dekorativ maqsadda.",
  },
  {
    id: "registon-mini",
    name: "Registon miniaturasi",
    type: "MUZEY_SUVENIRLARI",
    category: "Muzey ashyolari replikalari",
    price: 650000,
    image: p6,
    museum: "Amir Temur Museum",
    museumId: "amir-temur",
    maker: "Muzey ustaxonasi",
    dimensions: "28 × 18 sm, balandligi 14 sm",
    short: "Samarqand Registonining detallashgan loy miniaturasi.",
    description:
      "Sherdor, Tillakori va Ulug'bek madrasalarining aniq nusxasi. Qo'lda bo'yalgan, har bir minora alohida shakllantirilgan. Ofis va uy uchun ajoyib esdalik.",
  },
  {
    id: "kumush-uzuk",
    name: "Kumush an'anaviy uzuk",
    type: "MOHIR_QOLLAR",
    category: "Zargarlik buyumlari",
    price: 480000,
    image: bukhara,
    museum: "Bukhara Ark Museum",
    museumId: "bukhara-ark",
    maker: "Abdulloh Nazarov",
    dimensions: "O'lcham 17–20 (sozlanuvchi)",
    short: "Markazida feruza — Buxoro ustalari tomonidan tayyorlangan.",
    description:
      "925 kumush, markazida tabiiy feruza. An'anaviy ko'z (nazar) ramzi — yomon ko'zdan himoya qiluvchi to'g'on.",
  },
  {
    id: "loy-haykal",
    name: "Sogd zodagonining haykali",
    type: "MUZEY_SUVENIRLARI",
    category: "Muzey ashyolari replikalari",
    price: 880000,
    image: figurines,
    museum: "Amir Temur Museum",
    museumId: "amir-temur",
    maker: "Muzey ustaxonasi",
    dimensions: "Balandligi 28 sm",
    short: "VIII asr Sogd zodagoni siymosining miniatura nusxasi.",
    description:
      "Afrosiyob qazilmalaridan topilgan terakota busti asosida tayyorlangan. Qo'lda shakllantirilgan, antik effekt bilan yakunlangan.",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelated(id: string, limit = 4): Product[] {
  const current = getProduct(id);
  if (!current) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((p) => p.id !== id && p.category === current.category)
    .concat(PRODUCTS.filter((p) => p.id !== id && p.type === current.type && p.category !== current.category))
    .concat(PRODUCTS.filter((p) => p.id !== id && p.type !== current.type))
    .slice(0, limit);
}

export function getMuseumProducts(museumId: string, excludeId: string, limit = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.museumId === museumId && p.id !== excludeId);
  if (same.length >= limit) return same.slice(0, limit);
  const extra = PRODUCTS.filter((p) => p.museumId !== museumId && p.id !== excludeId);
  return same.concat(extra).slice(0, limit);
}

export function getProductsByMuseum(museumId: string): Product[] {
  return PRODUCTS.filter((p) => p.museumId === museumId);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price);
}
