import b1 from "@/assets/blog-1.jpg";
import b2 from "@/assets/blog-2.jpg";
import b3 from "@/assets/blog-3.jpg";
import b4 from "@/assets/blog-4.jpg";
import museum1 from "@/assets/museum-temur.jpg";
import museum2 from "@/assets/museum-history.jpg";
import museum3 from "@/assets/museum-savitsky.jpg";
import museum4 from "@/assets/museum-bukhara.jpg";

export type Fair = {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  image: string;
  short: string;
};

export type Masterclass = {
  id: string;
  title: string;
  craft: string;
  instructor: string;
  date: string;
  duration: string;
  level: string;
  image: string;
  short: string;
  spots: number;
};

export type Activity = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  image: string;
  short: string;
  free: boolean;
};

export const FAIRS: Fair[] = [
  {
    id: "toshkent-yarmarkasi",
    title: "Toshkent Hunarmandlar yarmarkasi",
    date: "15–18 May, 2026",
    location: "Amir Temur xiyoboni",
    city: "Toshkent",
    image: museum1,
    short: "O'zbekistonning 14 viloyatidan 200 dan ortiq hunarmand ishtirok etadi. Zargarlik, keramika, kashtachilik va to'qimachilik namunalari.",
  },
  {
    id: "samarkand-ipak-yoli",
    title: "Samarqand Ipak yo'li festivali",
    date: "6–9 Iyun, 2026",
    location: "Registon maydoni",
    city: "Samarqand",
    image: b2,
    short: "Har yili Registon maydonida o'tkaziluvchi xalqaro festival. Ipak matolar, an'anaviy kiyimlar va etnografik ko'rgazmalar.",
  },
  {
    id: "buxoro-amir-bozori",
    title: "Buxoro Amirlar bazori",
    date: "20–22 Iyul, 2026",
    location: "Ark qal'asi oldida",
    city: "Buxoro",
    image: museum4,
    short: "Buxoro Ark qal'asi oldida joylashgan tarixiy bozor. Kumush zargarlik, laqabi gilamlar va asl Buxoro ipak mahsulotlari.",
  },
];

export const MASTERCLASSES: Masterclass[] = [
  {
    id: "rishton-keramika-mkl",
    title: "Rishton keramikasi: lagan chizish",
    craft: "Sopol buyumlar",
    instructor: "Rustam Umarov",
    date: "24 May, 2026",
    duration: "3 soat",
    level: "Boshlang'ich",
    image: b1,
    short: "An'anaviy ishqor sir texnologiyasi bilan lagan chizishni o'rganing. Barcha materiallar taqdim etiladi. Mashg'ulot oxirida o'z lagangingizni olib ketasiz.",
    spots: 8,
  },
  {
    id: "kumush-filigran-mkl",
    title: "Kumush filigran: uzuk yasash",
    craft: "Zargarlik buyumlari",
    instructor: "Abdulloh Nazarov",
    date: "31 May, 2026",
    duration: "4 soat",
    level: "Barcha darajalar",
    image: b3,
    short: "925 kumush sim bilan filigran naqsh yaratishni o'rganing. Buxoro an'anasidagi klassik uzuk namunasini o'zingiz yasaysiz.",
    spots: 6,
  },
  {
    id: "kashtachilik-mkl",
    title: "Suzani kashtachilik asoslari",
    craft: "Kashtachilik",
    instructor: "Mohlaroyim Rahimova",
    date: "7 Iyun, 2026",
    duration: "5 soat",
    level: "Boshlang'ich",
    image: b4,
    short: "An'anaviy anor va gul motivlarini ipak ip bilan kashtalashni o'rganing. Barcha materiallar beriladi, boshlovchilar uchun qulay.",
    spots: 10,
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "afrosiab-yangi",
    title: "Afrosiyob qazilmalari: yangi topilmalar ko'rgazmasi",
    type: "Ko'rgazma",
    date: "1 May – 30 Iyun, 2026",
    location: "Amir Temur muzeyi, Toshkent",
    image: museum2,
    short: "2025-yil qazilmalarida topilgan II–V asr Sogd buyumlari birinchi marta jamoatchilikka namoyish etilmoqda. 43 ta yangi eksponat.",
    free: false,
  },
  {
    id: "ipak-namoyish",
    title: "Tirik to'quv: Marg'ilon ipak ustalarining namoyishi",
    type: "Namoyish",
    date: "18 May, 2026",
    location: "Savitskiy muzeyi, Nukus",
    image: museum3,
    short: "Marg'ilon atlasidan kelgan to'quvchi ustalar an'anaviy dastgoh ishlashini jonli ko'rsatadi. Savol-javob va mini-yarmarkasi ham bo'ladi.",
    free: true,
  },
  {
    id: "milliy-kiyimlar",
    title: "O'zbek milliy kiyimlari: asrlar osha",
    type: "Ko'rgazma",
    date: "10 Iyun – 10 Avgust, 2026",
    location: "O'zbekiston Tarixi davlat muzeyi, Toshkent",
    image: museum2,
    short: "XVI asrdan XX asrgacha bo'lgan 120 ta noyob milliy kiyim. To'n, jiyda, qo'ldirmа va bosh kiyimlar — yangi restavratsiya ishlaridan keyin birinchi marta ko'rinishda.",
    free: false,
  },
];
