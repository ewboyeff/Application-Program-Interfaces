import sanat from "@/assets/museum-sanat.jpg";
import tarix from "@/assets/museum-tarix.webp";
import temuriylar from "@/assets/museum-temuriylar.jpg";
import amaliy from "@/assets/museum-amaliy.jpg";
import tabiat from "@/assets/museum-tabiat.jpg";
import olimpiya from "@/assets/museum-olimpiya.jpg";
import behzod from "@/assets/museum-behzod.jpg";

export type Museum = {
  id: string;
  name: string;
  city: string;
  region: string;
  image: string;
  short: string;
  description: string;
  founded: string;
  exhibits: string;
  productIds: string[];
};

export const ALL_REGIONS = [
  "Toshkent",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Samarqand",
  "Jizzax",
  "Sirdaryo",
  "Navoiy",
  "Buxoro",
  "Qashqadaryo",
  "Surxondaryo",
  "Xorazm",
  "Qoraqalpog'iston",
] as const;

export const MUSEUMS: Museum[] = [
  {
    id: "davlat-sanat",
    name: "O'zbekiston davlat San'at muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: sanat,
    short: "O'zbek, sharq va g'arb tasviriy san'atining boy kolleksiyasi.",
    description:
      "1918-yilda tashkil etilgan muzey 50 000 dan ortiq asarni o'z ichiga oladi. O'zbek milliy san'ati, Rossiya klassiklari va G'arbiy Yevropa rassomlari asarlari saqlanadi.",
    founded: "1918",
    exhibits: "50 000+",
    productIds: ["suzani", "ipak-ikat", "rishton-lagan", "samarkand-kosa"],
  },
  {
    id: "tarix-davlat",
    name: "O'zbekiston tarixi davlat muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: tarix,
    short: "Markaziy Osiyoning eng yirik tarix muzeyi — 1.5 million yillik xronika.",
    description:
      "1876-yilda tashkil etilgan muzey 250 000 dan ortiq eksponatni o'z ichiga oladi. Sak va Sogdlar davridan to zamonaviy O'zbekistongacha bo'lgan tarix hujjatlashtirilgan.",
    founded: "1876",
    exhibits: "250 000+",
    productIds: ["yog-chiroq", "lauh", "loy-haykal", "kok-choynak"],
  },
  {
    id: "temuriylar-tarix",
    name: "Temuriylar tarixi davlat muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: temuriylar,
    short: "Buyuk Sohibqiron va temuriylar saltanati merosi.",
    description:
      "1996-yilda tashkil etilgan muzey Amir Temur va temuriylar davrining 3 000 dan ortiq nodir eksponatini saqlaydi. Qo'lyozmalar, qurol-yarog'lar, zargarlik buyumlari namoyish etiladi.",
    founded: "1996",
    exhibits: "3 000+",
    productIds: ["bronza-chavandoz", "loy-haykal", "registon-mini", "samarkand-kosa"],
  },
  {
    id: "amaliy-sanat",
    name: "O'zbekiston amaliy san'at va hunarmandchilik tarixi davlat muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: amaliy,
    short: "XIX asr rus diplomatining uyida joylashgan noyob hunarmandchilik kolleksiyasi.",
    description:
      "1927-yilda tashkil etilgan muzey XIX asrga oid manzil — rus diplomatining hashamatli uyida joylashgan. 7 000 dan ortiq o'zbek milliy kashtachilik, kulolchilik, to'qimachilik va zargarlik namunalari saqlanadi.",
    founded: "1927",
    exhibits: "7 000+",
    productIds: ["suzani", "kumush-uzuk", "bukhara-marjon", "ipak-ikat"],
  },
  {
    id: "tabiat-davlat",
    name: "O'zbekiston davlat tabiat muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: tabiat,
    short: "O'rta Osiyoning geologiyasi, florasi va faunasi haqida to'liq ma'lumot.",
    description:
      "1876-yilda asoslangan muzey minerallar, qazilma hayvonlar, o'simliklar va hayvonot dunyosiga oid 250 000 dan ortiq namunani o'z ichiga oladi. Mintaqaning tabiiy boyliklarini o'rganish uchun asosiy ilmiy markaz.",
    founded: "1876",
    exhibits: "250 000+",
    productIds: ["rishton-lagan", "samarkand-kosa", "lauh", "kok-choynak"],
  },
  {
    id: "olimpiya-shuhrat",
    name: "Olimpiya va paralimpiya shon-shuhrati muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: olimpiya,
    short: "O'zbek sportchilarining olimpiya va paralimpiya yutuqlari tarixi.",
    description:
      "Muzey O'zbekistonning olimpiya va paralimpiya harakatidagi shon-shuhratli tarixini aks ettiradi. Medal va kubok kolleksiyalari, sport afsонаlari haqidagi hujjatlar va interaktiv ko'rgazmalar namoyish etiladi.",
    founded: "2013",
    exhibits: "5 000+",
    productIds: ["bronza-chavandoz", "loy-haykal", "yog-chiroq", "lauh"],
  },
  {
    id: "behzod-miniatura",
    name: "Kamoliddin Behzod nomidagi Sharq miniatura san'ati muzeyi",
    city: "Toshkent",
    region: "Toshkent",
    image: behzod,
    short: "Sharq miniatyura san'atining durdonalari — XV asrdan bugungi kungacha.",
    description:
      "Buyuk miniatyurachilardan Kamoliddin Behzod nomi bilan atalgan muzey o'rta asr qo'lyozmalari bezaklari, Hirot va Buxoro maktablariga oid miniatyuralar hamda zamonaviy ustalар ijodini saqlaydi.",
    founded: "2004",
    exhibits: "2 000+",
    productIds: ["registon-mini", "lauh", "suzani", "bukhara-marjon"],
  },
];

export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS.find((m) => m.id === id);
}
