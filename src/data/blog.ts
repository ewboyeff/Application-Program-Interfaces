import b1 from "@/assets/blog-1.jpg";
import b2 from "@/assets/blog-2.jpg";
import b3 from "@/assets/blog-3.jpg";
import b4 from "@/assets/blog-4.jpg";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "rishton-keramikasi",
    title: "Rishton keramikasi: ko'k naqshlar tilidagi rivoyat",
    excerpt:
      "Bir tutam loy va to'rt rangli sir — Rishton ustalari ming yildan beri qanday qilib tarixni saqlab kelmoqda.",
    image: b1,
    category: "Hunarmandchilik",
    date: "12 Mart, 2026",
    readTime: "6 daqiqa",
    body: [
      "Farg'ona vodiysidagi kichik shahar — Rishton — XI asrdan boshlab Markaziy Osiyoning eng mashhur keramika markaziga aylangan.",
      "Mahalliy qizil loy va Chotqol tog'idagi minerallar maxsus 'ishqor' deb ataluvchi sir uchun zarur barcha komponentlarni beradi. Bu siroldan eng go'zal ko'k va feruza ranglar tug'iladi.",
      "Bugungi kunda Rishton ustalari UNESCO ro'yxatiga kiritilgan an'anaviy texnologiyalarni saqlab qolgan. Har bir lagan, kosa va ko'za — qo'lda chiziladi va o'tin pechida 14 soat davomida kuydiriladi.",
      "Bizning kolleksiyamizdagi har bir Rishton buyumi 4-avlod ustalar oilasidan keladi va muzeyda saqlanayotgan eksponatga aniq mosligini kafolatlovchi sertifikatga ega.",
    ],
  },
  {
    id: "registon-sirlari",
    title: "Registon sirlari: madrasalar tilshunosligi",
    excerpt:
      "Samarqand markazida joylashgan uch madrasa — bu shunchaki bino emas, balki butun bir falsafa.",
    image: b2,
    category: "Tarix",
    date: "28 Fevral, 2026",
    readTime: "8 daqiqa",
    body: [
      "Registon — \"qumli joy\" degan ma'noni anglatadi. Aslida bu Samarqandning ilm va savdo markazi edi.",
      "Ulug'bek madrasasi (1417), Sherdor (1636) va Tillakori (1660) — har biri o'z davrining me'morchilik va kalligrafiya cho'qqisi.",
      "Sherdor peshtoqidagi sherlar — islom an'anasidagi taqiqqa qarshi noyob hodisa. Bu temuriylar davrining erkin ruhini namoyish etadi.",
    ],
  },
  {
    id: "ipak-yoli-toqimasi",
    title: "Ipak yo'li to'qimasi: Marg'ilonning 2000 yillik ovozi",
    excerpt:
      "Marg'ilon abr-bandi — bulutlardan to'qilgan mato. Bu noyob texnika qanday saqlanib qolgan?",
    image: b3,
    category: "An'analar",
    date: "14 Fevral, 2026",
    readTime: "5 daqiqa",
    body: [
      "Abr-bandi — \"bulutlarni bog'lash\" degan ma'noni beradi. Bu — iplarni bo'yashdan oldin maxsus bog'lash usuli.",
      "Marg'ilon ustalari ming yildan ortiq vaqt davomida bu sirni o'zgartirmadi. Tabiiy bo'yoqlar, qo'l mehnati va sabr — uchta asosiy uslub.",
      "Bir ko'ylaklik mato uchun 6 oy ish kerak bo'ladi. Ammo natija — bu butun umrga yetadigan asar.",
    ],
  },
  {
    id: "buxoro-zargarligi",
    title: "Buxoro zargarligi: filigranning sirli san'ati",
    excerpt:
      "Kumushdan o'rilgan dantela — Buxoro zargarlari mahoratining asosi.",
    image: b4,
    category: "San'at",
    date: "30 Yanvar, 2026",
    readTime: "7 daqiqa",
    body: [
      "Filigran — bu juda nozik kumush tellardan yasalgan zargarlik buyumlari. Buxoro filigrani — Markaziy Osiyodagi eng nozik va nafis hisoblanadi.",
      "Har bir uzuk, marjon va sirg'a — usta tomonidan haftalar davomida qo'lda yig'iladi. Bir gramm kumushdan 50 metr tel cho'ziladi.",
      "Feruza, agat va marjon toshlari bilan birikma — bu insonni yomon nazardan saqlovchi an'anaviy kompozitsiya.",
    ],
  },
];

export function getPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.id === id);
}