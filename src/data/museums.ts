import temur from "@/assets/museum-temur.jpg";
import history from "@/assets/museum-history.jpg";
import savitsky from "@/assets/museum-savitsky.jpg";
import bukhara from "@/assets/museum-bukhara.jpg";

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
    id: "amir-temur",
    name: "Amir Temur Museum",
    city: "Toshkent",
    region: "Toshkent",
    image: temur,
    short: "Buyuk Sohibqiron va temuriylar saltanati merosi.",
    description:
      "1996-yilda tashkil etilgan muzey Amir Temur va temuriylar davriga oid 3000 dan ortiq nodir eksponatni o'z ichiga oladi.",
    founded: "1996",
    exhibits: "3 000+",
    productIds: ["bronza-chavandoz", "loy-haykal", "registon-mini", "samarkand-kosa"],
  },
  {
    id: "history-uz",
    name: "State Museum of History",
    city: "Toshkent",
    region: "Toshkent",
    image: history,
    short: "O'zbekiston tarixining 1.5 million yillik xronikasi.",
    description:
      "Markaziy Osiyoning eng yirik tarix muzeyi. Sak va Sogdlar davridan to bugungi kungacha bo'lgan davr eksponatlari.",
    founded: "1876",
    exhibits: "300 000+",
    productIds: ["yog-chiroq", "lauh", "loy-haykal", "kok-choynak"],
  },
  {
    id: "savitsky",
    name: "Savitsky Museum",
    city: "Nukus",
    region: "Qoraqalpog'iston",
    image: savitsky,
    short: "\"Sahrodagi Luvr\" — sovet avangardi noyob kolleksiyasi.",
    description:
      "Igor Savitsky tomonidan yig'ilgan dunyodagi eng katta sovet avangardi va Karakalpakiston san'ati kolleksiyasi.",
    founded: "1966",
    exhibits: "90 000+",
    productIds: ["suzani", "ipak-ikat", "lauh", "rishton-lagan"],
  },
  {
    id: "bukhara-ark",
    name: "Bukhara Ark Museum",
    city: "Buxoro",
    region: "Buxoro",
    image: bukhara,
    short: "Buxoro amirlari saroyi — VIII asrdan beri saqlangan qal'a.",
    description:
      "Buxoroning eng qadimiy yodgorligi. Amirlar saroyi, taxt zali, miniatyurа kollektsiyasi va qo'lyozmalar saqlanadi.",
    founded: "VIII asr",
    exhibits: "12 000+",
    productIds: ["bukhara-marjon", "kumush-uzuk", "suzani", "samarkand-kosa"],
  },
];

export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS.find((m) => m.id === id);
}