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

export type Category =
  | "Keramika"
  | "Zargarlik"
  | "Haykallar"
  | "Milliy naqshlar";

export const CATEGORIES: readonly ("Barchasi" | Category)[] = [
  "Barchasi",
  "Keramika",
  "Zargarlik",
  "Haykallar",
  "Milliy naqshlar",
] as const;

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number; // in so'm
  image: string;
  museum: string;
  short: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "rishton-lagan",
    name: "Rishton ko'k lagan",
    category: "Keramika",
    price: 420000,
    image: rishton,
    museum: "Rishton State Museum",
    short: "Feruza va ko'k naqshlardagi an'anaviy lagan — qo'lda chizilgan.",
    description:
      "Rishton shahridagi mashhur ustalar tomonidan an'anaviy ishqor sirlash usulida tayyorlangan. Har bir lagan unikal — qadimgi muzey eksponati nusxasi asosida 14 kun davomida qo'lda bezatiladi.",
  },
  {
    id: "samarkand-kosa",
    name: "Samarqand naqshli kosa",
    category: "Keramika",
    price: 560000,
    image: samarkand,
    museum: "Afrosiyob Museum",
    short: "XV asr saroy idishlaridan ilhomlangan oltin va lojuvard kosa.",
    description:
      "Amir Temur saroyidagi keramika asosida zamonaviy ustalar tomonidan tiklangan. Qo'lda yasalgan, yuqori haroratda kuydirilgan va 24 karat oltin ramz bilan bezatilgan.",
  },
  {
    id: "bukhara-marjon",
    name: "Buxoro filigran marjoni",
    category: "Zargarlik",
    price: 1800000,
    image: bukhara,
    museum: "Bukhara Ark Museum",
    short: "Kumush filigran, qizil agat va feruza — amir saroyi xazinasidan.",
    description:
      "925-shoyi kumush, qizil agat va Nishopur feruzasidan tayyorlangan. XIX asr Buxoro amiri sarayidagi marjon nusxasi — har bir buyum sertifikatlangan.",
  },
  {
    id: "bronza-chavandoz",
    name: "Bronza chavandoz haykalcha",
    category: "Haykallar",
    price: 920000,
    image: figurines,
    museum: "Termiz Archaeological",
    short: "Buyuk Ipak yo'li jangchisining bronza siymolari.",
    description:
      "Termiz arxeologik muzeyidagi I asr bronza haykalining miniaturasi. Qo'lda quyilgan, antik patina effektida yakunlangan, granit poydevor bilan keladi.",
  },
  {
    id: "kok-choynak",
    name: "Ko'k naqshli choynak",
    category: "Keramika",
    price: 320000,
    image: p1,
    museum: "Rishton State Museum",
    short: "Qo'lda chizilgan klassik Rishton uslubidagi mayda choynak.",
    description:
      "Sof ozodalik va an'analar uyg'unligi. Choyxona uchun ideal — issiq saqlash va beshikni ko'tarib turuvchi mustahkam tutqich bilan.",
  },
  {
    id: "ipak-ikat",
    name: "Ipak ikat ro'mol",
    category: "Milliy naqshlar",
    price: 540000,
    image: p2,
    museum: "Margilon Atlas Museum",
    short: "Marg'ilon ustalari tomonidan an'anaviy abr-bandi usulida to'qilgan.",
    description:
      "100% tabiiy tut ipagi. Ranglar tabiiy bo'yoqlardan — anor po'sti, ko'k indigo, oltin qabuq. Har bir ro'mol uch usta nazoratida 21 kun mehnat mahsulidir.",
  },
  {
    id: "lauh",
    name: "Yog'och lauh kitobligi",
    category: "Milliy naqshlar",
    price: 780000,
    image: p3,
    museum: "Khiva Heritage Center",
    short: "Xivada qo'lda o'yilgan, an'anaviy o'simlik motivlari bilan.",
    description:
      "Tut yog'ochidan, bir bo'lakdan o'yilgan. An'anaviy islimi naqshlar bilan bezatilgan, mum bilan pardozlangan. Quron yoki katta kitob uchun mukammal.",
  },
  {
    id: "suzani",
    name: "Suzani gilam panel",
    category: "Milliy naqshlar",
    price: 1200000,
    image: p4,
    museum: "Bukhara Suzani Hall",
    short: "Qizil va oltin ranglardagi an'anaviy suzani — devor uchun.",
    description:
      "Buxoro ayollari tomonidan qo'lda kashtalangan. Anor, gul va quyosh ramzlari bilan bezatilgan — uy, sevgi va baraka uchun an'anaviy in'om.",
  },
  {
    id: "yog-chiroq",
    name: "Bronza yog' chiroq",
    category: "Haykallar",
    price: 740000,
    image: p5,
    museum: "Tashkent Applied Arts",
    short: "X asr yog' chirog'i — antik bronza patinasi bilan.",
    description:
      "Qadimda Buxoro karvonsaroylarida ishlatilgan chiroq nusxasi. Qo'lda quyilgan bronza, sirpanma poydevor, dekorativ maqsadda.",
  },
  {
    id: "registon-mini",
    name: "Registon miniaturasi",
    category: "Haykallar",
    price: 650000,
    image: p6,
    museum: "Samarkand Afrosiyob",
    short: "Samarqand Registonining detallashgan loy miniaturasi.",
    description:
      "Sherdor, Tillakori va Ulug'bek madrasalarining aniq nusxasi. Qo'lda bo'yalgan, har bir minora alohida shakllantirilgan. Ofis va uy uchun ajoyib esdalik.",
  },
  {
    id: "kumush-uzuk",
    name: "Kumush ananaviy uzuk",
    category: "Zargarlik",
    price: 480000,
    image: bukhara,
    museum: "Bukhara Ark Museum",
    short: "Markazida feruza — Buxoro ustalari tomonidan tayyorlangan.",
    description:
      "925 kumush, markazida tabiiy feruza. An'anaviy ko'z (nazar) ramzi — yomon ko'zdan himoya qiluvchi to'g'on.",
  },
  {
    id: "loy-haykal",
    name: "Sogd zodagonining haykali",
    category: "Haykallar",
    price: 880000,
    image: figurines,
    museum: "Afrosiyob Museum",
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
    .concat(PRODUCTS.filter((p) => p.id !== id && p.category !== current.category))
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price);
}