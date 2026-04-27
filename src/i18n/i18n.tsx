import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type Lang = "uz" | "ru" | "en";

const STORAGE_KEY = "ms_lang_v1";

type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  uz: {
    // Nav
    "nav.home": "Bosh sahifa",
    "nav.shop": "Kolleksiya",
    "nav.museums": "Muzeylar",
    "nav.blog": "Blog",
    "nav.contact": "Aloqa",
    // Icons / labels
    "icon.search": "Qidirish",
    "icon.wishlist": "Sevimlilar",
    "icon.cart": "Savat",
    "icon.menu": "Menyu",
    // CTAs
    "cta.viewCollection": "Kolleksiyani ko'rish",
    "cta.buyNow": "Sotib olish",
    "cta.readStory": "Hikoyani o'qish",
    "cta.viewMuseums": "Muzeylarni ko'rish",
    "cta.addToCart": "Savatga qo'shish",
    "cta.subscribe": "Obuna",
    // Search
    "search.eyebrow": "— Qidiruv",
    "search.placeholder": "Mahsulot, kategoriya yoki muzey nomi...",
    "search.hint": "Yozishni boshlang — masalan, \"Rishton\", \"Zargarlik\" yoki \"Buxoro\".",
    "search.empty": "Hech narsa topilmadi.",
    "search.close": "Yopish",
    // Categories
    "cat.all": "Barchasi",
    "cat.ceramics": "Keramika",
    "cat.jewelry": "Zargarlik",
    "cat.statues": "Haykallar",
    "cat.patterns": "Milliy naqshlar",
    // Sections
    "sec.categoriesEyebrow": "— Toifalar",
    "sec.categoriesTitle1": "Sayohat",
    "sec.categoriesTitle2": "toifalar bo'ylab",
    "sec.collectionsEyebrow": "— Yangiliklar",
    "sec.collectionsTitle1": "Yangi",
    "sec.collectionsTitle2": "kolleksiyalar",
    "sec.collectionsLead": "Har bir buyum — O'zbekiston hududidan topilgan haqiqiy eksponatga sodiq qo'lda tayyorlangan zamonaviy talqin.",
    "sec.featuredEyebrow": "— Tanlangan",
    "sec.featuredTitle1": "Mashhur",
    "sec.featuredTitle2": "Suvenirlar",
    "sec.storyEyebrow": "— Bizning hikoyamiz",
    "sec.newsletterEyebrow": "— Yangiliklar",
    "sec.newsletter": "Yangi eksponatlar haqida birinchi bo'lib biling.",
    "sec.emailPh": "E-pochta manzilingiz",
    // Footer
    "footer.shop": "Do'kon",
    "footer.museum": "Muzey",
    "footer.help": "Yordam",
    "footer.newCollection": "Yangi kolleksiya",
    "footer.partnerMuseums": "Hamkor muzeylar",
    "footer.rights": "© 2026 Museum Shop Uzbekistan. Barcha huquqlar himoyalangan.",
    "footer.cities": "Toshkent · Samarqand · Buxoro · Xiva",
    "footer.tagline": "O'zbekistonning tarixiy merosini uyingizga olib keluvchi noyob suvenirlar do'koni.",
    // Hero misc
    "hero.prev": "Oldingi",
    "hero.next": "Keyingi",
    "lang.label": "Til",
  },
  ru: {
    "nav.home": "Главная",
    "nav.shop": "Коллекция",
    "nav.museums": "Музеи",
    "nav.blog": "Блог",
    "nav.contact": "Контакты",
    "icon.search": "Поиск",
    "icon.wishlist": "Избранное",
    "icon.cart": "Корзина",
    "icon.menu": "Меню",
    "cta.viewCollection": "Смотреть коллекцию",
    "cta.buyNow": "Купить",
    "cta.readStory": "Читать историю",
    "cta.viewMuseums": "Смотреть музеи",
    "cta.addToCart": "В корзину",
    "cta.subscribe": "Подписка",
    "search.eyebrow": "— Поиск",
    "search.placeholder": "Название товара, категории или музея...",
    "search.hint": "Начните вводить — например, «Риштан», «Ювелирика» или «Бухара».",
    "search.empty": "Ничего не найдено.",
    "search.close": "Закрыть",
    "cat.all": "Все",
    "cat.ceramics": "Керамика",
    "cat.jewelry": "Ювелирика",
    "cat.statues": "Скульптуры",
    "cat.patterns": "Народные узоры",
    "sec.categoriesEyebrow": "— Категории",
    "sec.categoriesTitle1": "Путешествие",
    "sec.categoriesTitle2": "по категориям",
    "sec.collectionsEyebrow": "— Новинки",
    "sec.collectionsTitle1": "Новые",
    "sec.collectionsTitle2": "коллекции",
    "sec.collectionsLead": "Каждый предмет — современная интерпретация подлинного экспоната, найденного на территории Узбекистана, выполненная вручную.",
    "sec.featuredEyebrow": "— Избранное",
    "sec.featuredTitle1": "Популярные",
    "sec.featuredTitle2": "сувениры",
    "sec.storyEyebrow": "— Наша история",
    "sec.newsletterEyebrow": "— Новости",
    "sec.newsletter": "Узнавайте о новых экспонатах первыми.",
    "sec.emailPh": "Ваш e-mail",
    "footer.shop": "Магазин",
    "footer.museum": "Музей",
    "footer.help": "Помощь",
    "footer.newCollection": "Новая коллекция",
    "footer.partnerMuseums": "Музеи-партнёры",
    "footer.rights": "© 2026 Museum Shop Uzbekistan. Все права защищены.",
    "footer.cities": "Ташкент · Самарканд · Бухара · Хива",
    "footer.tagline": "Магазин уникальных сувениров, которые приносят историческое наследие Узбекистана в ваш дом.",
    "hero.prev": "Назад",
    "hero.next": "Вперёд",
    "lang.label": "Язык",
  },
  en: {
    "nav.home": "Home",
    "nav.shop": "Collection",
    "nav.museums": "Museums",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "icon.search": "Search",
    "icon.wishlist": "Wishlist",
    "icon.cart": "Cart",
    "icon.menu": "Menu",
    "cta.viewCollection": "View Collection",
    "cta.buyNow": "Buy Now",
    "cta.readStory": "Read the story",
    "cta.viewMuseums": "Explore museums",
    "cta.addToCart": "Add to cart",
    "cta.subscribe": "Subscribe",
    "search.eyebrow": "— Search",
    "search.placeholder": "Product, category or museum name...",
    "search.hint": "Start typing — e.g. \"Rishton\", \"Jewelry\" or \"Bukhara\".",
    "search.empty": "Nothing found.",
    "search.close": "Close",
    "cat.all": "All",
    "cat.ceramics": "Ceramics",
    "cat.jewelry": "Jewelry",
    "cat.statues": "Statues",
    "cat.patterns": "Ornaments",
    "sec.categoriesEyebrow": "— Categories",
    "sec.categoriesTitle1": "Journey",
    "sec.categoriesTitle2": "across categories",
    "sec.collectionsEyebrow": "— New",
    "sec.collectionsTitle1": "New",
    "sec.collectionsTitle2": "collections",
    "sec.collectionsLead": "Each piece is a modern, hand-crafted reinterpretation faithful to a real artifact found across Uzbekistan.",
    "sec.featuredEyebrow": "— Featured",
    "sec.featuredTitle1": "Popular",
    "sec.featuredTitle2": "Souvenirs",
    "sec.storyEyebrow": "— Our story",
    "sec.newsletterEyebrow": "— Newsletter",
    "sec.newsletter": "Be the first to discover new exhibits.",
    "sec.emailPh": "Your email address",
    "footer.shop": "Shop",
    "footer.museum": "Museum",
    "footer.help": "Help",
    "footer.newCollection": "New collection",
    "footer.partnerMuseums": "Partner museums",
    "footer.rights": "© 2026 Museum Shop Uzbekistan. All rights reserved.",
    "footer.cities": "Tashkent · Samarkand · Bukhara · Khiva",
    "footer.tagline": "A boutique of unique souvenirs bringing Uzbekistan's historic heritage into your home.",
    "hero.prev": "Previous",
    "hero.next": "Next",
    "lang.label": "Language",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "uz" || saved === "ru" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect on <html lang="">
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang][key] ?? DICTS.uz[key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback (shouldn't happen if Provider is mounted)
    return {
      lang: "uz",
      setLang: () => {},
      t: (k) => DICTS.uz[k] ?? k,
    };
  }
  return ctx;
}

export const LANGS: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];