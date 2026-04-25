import { Fund, News, Project, Grade } from '../types';

export const MOCK_FUNDS: Fund[] = [
  {
    id: "1",
    slug: "mehr-fondi",
    name_uz: "Mehr Fondi",
    name_ru: "Фонд Мехр",
    name_en: "Mehr Fund",
    category: "Ta'lim",
    region: "Toshkent",
    director: "Dilnoza Yusupova",
    founded_year: 2018,
    description_uz: "Bolalar ta'limini qo'llab-quvvatlash va maktablarni rivojlantirish fondi",
    logo_initials: "MF",
    logo_color: "#1A56DB",
    website: "mehrfondi.uz",
    telegram: "t.me/mehrfondi",
    inn: "123456789",
    registration: "UZ-2018-0234",
    is_verified: true,
    indexes: {
      transparency: 95,
      openness: 88,
      trust: 90,
      overall: 92,
      grade: "platinum" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 12,
    beneficiaries: 45000,
    total_income: 1240000000,
    total_spent: 1180000000
  },
  {
    id: "2",
    slug: "umid-jamgarmasi",
    name_uz: "Umid Jamg'armasi",
    name_ru: "Фонд Умид",
    name_en: "Umid Foundation",
    category: "Sog'liqni saqlash",
    region: "Samarqand",
    director: "Bobur Mirzayev",
    founded_year: 2015,
    description_uz: "Kam ta'minlangan oilalarga tibbiy yordam ko'rsatish fondi",
    logo_initials: "UJ",
    logo_color: "#059669",
    website: "umidfond.uz",
    telegram: "t.me/umidfond",
    inn: "987654321",
    registration: "UZ-2015-0112",
    is_verified: true,
    indexes: {
      transparency: 82,
      openness: 88,
      trust: 85,
      overall: 85,
      grade: "gold" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 8,
    beneficiaries: 28000,
    total_income: 890000000,
    total_spent: 820000000
  },
  {
    id: "3",
    slug: "yashil-dunyo",
    name_uz: "Yashil Dunyo",
    name_ru: "Зелёный Мир",
    name_en: "Green World",
    category: "Ekologiya",
    region: "Toshkent",
    director: "Kamola Rahimova",
    founded_year: 2020,
    description_uz: "Ekologik muammolarni hal qilish va yashil muhit yaratish fondi",
    logo_initials: "YD",
    logo_color: "#059669",
    website: "yashildunyo.uz",
    telegram: "t.me/yashildunyo",
    inn: "456789123",
    registration: "UZ-2020-0567",
    is_verified: true,
    indexes: {
      transparency: 90,
      openness: 85,
      trust: 88,
      overall: 88,
      grade: "gold" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 6,
    beneficiaries: 12000,
    total_income: 560000000,
    total_spent: 510000000
  },
  {
    id: "4",
    slug: "baxt-uyi",
    name_uz: "Baxt Uyi",
    name_ru: "Дом Счастья",
    name_en: "House of Happiness",
    category: "Ijtimoiy ko'mak",
    region: "Farg'ona",
    director: "Sardor Toshmatov",
    founded_year: 2019,
    description_uz: "Yetim va muhtoj bolalarga yordam beruvchi xayriya fondi",
    logo_initials: "BU",
    logo_color: "#F59E0B",
    website: "baxtuyi.uz",
    telegram: "t.me/baxtuyi",
    inn: "321654987",
    registration: "UZ-2019-0389",
    is_verified: false,
    indexes: {
      transparency: 70,
      openness: 72,
      trust: 71,
      overall: 71,
      grade: "silver" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 4,
    beneficiaries: 8500,
    total_income: 320000000,
    total_spent: 295000000
  },
  {
    id: "5",
    slug: "shifa-markazi",
    name_uz: "Shifa Markazi",
    name_ru: "Центр Шифа",
    name_en: "Shifa Center",
    category: "Sog'liqni saqlash",
    region: "Buxoro",
    director: "Nodira Hasanova",
    founded_year: 2017,
    description_uz: "Nogironlar va surunkali kasalliklar bilan kurashuvchilarga yordam fondi",
    logo_initials: "SM",
    logo_color: "#8B5CF6",
    website: "shifamarkazi.uz",
    telegram: "t.me/shifamarkazi",
    inn: "654321789",
    registration: "UZ-2017-0278",
    is_verified: true,
    indexes: {
      transparency: 80,
      openness: 75,
      trust: 80,
      overall: 78,
      grade: "gold" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 9,
    beneficiaries: 19000,
    total_income: 720000000,
    total_spent: 680000000
  },
  {
    id: "6",
    slug: "nur-fondi",
    name_uz: "Nur Fondi",
    name_ru: "Фонд Нур",
    name_en: "Nur Fund",
    category: "Kambag'alikni qisqartirish",
    region: "Namangan",
    director: "Alisher Qodirov",
    founded_year: 2021,
    description_uz: "Qishloq maktablarini kompyuter va internet bilan ta'minlash fondi",
    logo_initials: "NF",
    logo_color: "#EA580C",
    website: "nurfond.uz",
    telegram: "t.me/nurfond",
    inn: "789123456",
    registration: "UZ-2021-0891",
    is_verified: false,
    indexes: {
      transparency: 52,
      openness: 58,
      trust: 55,
      overall: 55,
      grade: "bronze" as const,
      calculated_at: "2025-04-15"
    },
    projects_count: 3,
    beneficiaries: 4200,
    total_income: 180000000,
    total_spent: 150000000
  }
];

export const MOCK_NEWS: News[] = [
  {
    id: "1",
    category: "Fond yangiligi",
    title: "Mehr Fondi 2024 yillik moliyaviy hisobotini e'lon qildi",
    title_uz: "Mehr Fondi 2024 yillik moliyaviy hisobotini e'lon qildi",
    excerpt: "Fond o'tgan yil 1.2 milliard so'm yig'ib, barcha loyihalar bo'yicha to'liq hisobotini nashr etdi",
    content: "Mehr Fondi 2024 yilgi faoliyati bo'yicha batafsil moliyaviy hisobotni e'lon qildi. Hisobotga ko'ra, fond yil davomida jami 1.24 milliard so'm mablag' yig'ib, shundan 1.18 milliard so'mini loyihalarga sarfladi. Barcha xarajatlar mustaqil auditorlar tomonidan tasdiqlangan.",
    fund_slug: "mehr-fondi",
    fund_name: "Mehr Fondi",
    fundId: "1",
    date: "2025-04-10",
    read_time: 3,
    gradient: "from-blue-500 to-primary-600",
    is_featured: true,
    active: true
  },
  {
    id: "2",
    category: "Fond yangiligi",
    title: "Yashil Dunyo Toshkentda 1000 ta daraxt ekish dasturini boshladi",
    title_uz: "Yashil Dunyo Toshkentda 1000 ta daraxt ekish dasturini boshladi",
    excerpt: "Ekologiya fondi poytaxt va viloyatlarda yashillashtirish loyihasini muvaffaqiyatli amalga oshirmoqda",
    content: "Yashil Dunyo fondi 2025 yil bahorida Toshkent shahrida 1000 ta daraxt ekish kampaniyasini boshladi.",
    fund_slug: "yashil-dunyo",
    fund_name: "Yashil Dunyo",
    fundId: "2",
    date: "2025-04-05",
    read_time: 2,
    gradient: "from-emerald-500 to-green-600",
    is_featured: true,
    active: true
  },
  {
    id: "3",
    category: "Platforma",
    title: "Platformaga 5 ta yangi fond qo'shildi",
    title_uz: "Platformaga 5 ta yangi fond qo'shildi",
    excerpt: "Yangi fondlar shaffoflik tekshiruvidan o'tib rasmiy ro'yxatga kiritildi",
    content: "Charity Index Uzbekistan platformasi 5 ta yangi xayriya fondini qabul qildi.",
    fund_slug: null,
    fund_name: null,
    fundId: null,
    date: "2025-04-01",
    read_time: 2,
    gradient: "from-violet-500 to-purple-600",
    is_featured: false,
    active: true
  },
  {
    id: "4",
    category: "Fond yangiligi",
    title: "Umid Jamg'armasi bepul tibbiy ko'rik o'tkazadi",
    title_uz: "Umid Jamg'armasi bepul tibbiy ko'rik o'tkazadi",
    excerpt: "Samarqand viloyatida 500 dan ortiq aholi bepul tibbiy ko'rikdan o'tish imkoniyatiga ega bo'ladi",
    content: "Umid Jamg'armasi fondi Samarqand viloyatida bepul tibbiy ko'rik kampaniyasini e'lon qildi.",
    fund_slug: "umid-jamgarmasi",
    fund_name: "Umid Jamg'armasi",
    fundId: "3",
    date: "2025-03-28",
    read_time: 3,
    gradient: "from-teal-500 to-emerald-600",
    is_featured: false,
    active: true
  },
  {
    id: "5",
    category: "Platforma",
    title: "Indeks hisoblash tizimi yangilandi",
    title_uz: "Indeks hisoblash tizimi yangilandi",
    excerpt: "Yangi algoritm fondlarni yanada aniqroq baholash imkonini beradi",
    content: "Charity Index platformasi indeks hisoblash algoritmini yangiladi.",
    fund_slug: null,
    fund_name: null,
    fundId: null,
    date: "2025-03-20",
    read_time: 4,
    gradient: "from-primary-500 to-blue-600",
    is_featured: false,
    active: true
  },
  {
    id: "6",
    category: "Fond yangiligi",
    title: "Shifa Markazi 500 ta nogironga yordamlashdi",
    title_uz: "Shifa Markazi 500 ta nogironga yordamlashdi",
    excerpt: "Buxoro viloyatidagi fond nogironlar uchun maxsus dasturini muvaffaqiyatli yakunladi",
    content: "Shifa Markazi fondi 2024 yilda nogironlarga ko'maklashish dasturini yakunladi.",
    fund_slug: "shifa-markazi",
    fund_name: "Shifa Markazi",
    fundId: "4",
    date: "2025-03-15",
    read_time: 3,
    gradient: "from-purple-500 to-violet-600",
    is_featured: false,
    active: true
  }
];

// Types are now in src/types.ts

export const MOCK_INDEX_FACTORS = {
  transparency: [
    { name: "Moliyaviy hisobotlar", weight: 25, score: 95 },
    { name: "Sarflash tafsiloti", weight: 20, score: 98 },
    { name: "Loyiha natijalari", weight: 20, score: 90 },
    { name: "Audit o'tkazilgan", weight: 20, score: 100 },
    { name: "Donor ma'lumotlari", weight: 15, score: 88 },
  ],
  openness: [
    { name: "Rasmiy veb-sayt", weight: 20, score: 100 },
    { name: "Ijtimoiy tarmoq faolligi", weight: 20, score: 85 },
    { name: "Media ko'rinishi", weight: 15, score: 80 },
    { name: "Murojaat imkoniyati", weight: 20, score: 90 },
    { name: "Yangiliklar chastotasi", weight: 25, score: 85 },
  ],
  trust: [
    { name: "Rasmiy ro'yxatdan o'tgan", weight: 25, score: 100 },
    { name: "Faoliyat davomiyligi", weight: 20, score: 85 },
    { name: "Foydalanuvchi reytingi", weight: 20, score: 88 },
    { name: "Shikoyatlar tarixi", weight: 20, score: 90 },
    { name: "Xalqaro hamkorlar", weight: 15, score: 85 },
  ]
};

export const MOCK_PROJECTS: Project[] = [
  { 
    id: "1",
    title: "100 ta maktabga kutubxona",
    title_uz: "100 ta maktabga kutubxona",
    fundId: "1",
    status: "completed",
    budget: 450000000, spent: 442000000,
    beneficiaries: 12000,
    region: "Toshkent viloyati",
    start_date: "2023-01-15",
    end_date: "2023-12-31"
  },
  {
    id: "2",
    title: "Yetim bolalar ta'lim dasturi",
    title_uz: "Yetim bolalar ta'lim dasturi",
    fundId: "1",
    status: "active",
    budget: 280000000, spent: 156000000,
    beneficiaries: 340,
    region: "Toshkent shahar",
    start_date: "2024-03-01",
    end_date: "2025-03-01"
  },
  {
    id: "3",
    title: "O'qituvchilar malaka oshirish",
    title_uz: "O'qituvchilar malaka oshirish",
    fundId: "2",
    status: "planned",
    budget: 120000000, spent: 0,
    beneficiaries: 200,
    region: "Toshkent viloyati",
    start_date: "2025-06-01",
    end_date: "2025-12-31"
  }
];

export const MOCK_REVIEWS = [
  { id:"1", user:"Aziz T.", date:"12 Mart 2025", rating:5, comment:"Juda shaffof fond. Hisobotlari aniq va tushunarli!" },
  { id:"2", user:"Malika R.", date:"3 Fevral 2025", rating:4, comment:"Yaxshi fond, ijtimoiy tarmoqda faolroq bo'lsa yaxshi bo'lardi." },
  { id:"3", user:"Jasur K.", date:"18 Yanvar 2025", rating:5, comment:"3 yildan beri kuzataman, har doim hisobotlari ochiq." }
];

export const MOCK_FINANCIAL = [
  { period:"2022", income:280000000, expense:260000000 },
  { period:"2023", income:450000000, expense:420000000 },
  { period:"2024", income:510000000, expense:500000000 },
];

export const MOCK_REPORTS = [
  { id:"1", title:"2024 Yillik Hisobot", type:"annual", period:"2024", is_verified: true },
  { id:"2", title:"2023 Yillik Hisobot", type:"annual", period:"2023", is_verified: true },
  { id:"3", title:"2024 Q1 Hisobot", type:"quarterly", period:"Q1 2024", is_verified: true },
];
