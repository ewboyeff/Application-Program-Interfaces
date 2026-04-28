import type { Lang } from "./i18n";

// Per-id localized content for products, museums, blog posts.
// Keys map to data file ids; if a translation is missing, UI falls back to "uz".

export type ProductT = { name: string; short: string; description: string };
export type MuseumT = { name: string; city: string; short: string; description: string; founded: string };
export type BlogT = { title: string; excerpt: string; category: string; date: string; readTime: string; body: string[] };

export const PRODUCT_T: Record<Lang, Record<string, ProductT>> = {
  uz: {
    "rishton-lagan": {
      name: "Rishton ko'k lagan",
      short: "Feruza va ko'k naqshlardagi an'anaviy lagan — qo'lda chizilgan.",
      description:
        "Rishton shahridagi mashhur ustalar tomonidan an'anaviy ishqor sirlash usulida tayyorlangan. Har bir lagan unikal — qadimgi muzey eksponati nusxasi asosida 14 kun davomida qo'lda bezatiladi.",
    },
    "samarkand-kosa": {
      name: "Samarqand naqshli kosa",
      short: "XV asr saroy idishlaridan ilhomlangan oltin va lojuvard kosa.",
      description:
        "Amir Temur saroyidagi keramika asosida zamonaviy ustalar tomonidan tiklangan. Qo'lda yasalgan, yuqori haroratda kuydirilgan va 24 karat oltin ramz bilan bezatilgan.",
    },
    "bukhara-marjon": {
      name: "Buxoro filigran marjoni",
      short: "Kumush filigran, qizil agat va feruza — amir saroyi xazinasidan.",
      description:
        "925-shoyi kumush, qizil agat va Nishopur feruzasidan tayyorlangan. XIX asr Buxoro amiri sarayidagi marjon nusxasi — har bir buyum sertifikatlangan.",
    },
    "bronza-chavandoz": {
      name: "Bronza chavandoz haykalcha",
      short: "Buyuk Ipak yo'li jangchisining bronza siymolari.",
      description:
        "Termiz arxeologik muzeyidagi I asr bronza haykalining miniaturasi. Qo'lda quyilgan, antik patina effektida yakunlangan, granit poydevor bilan keladi.",
    },
    "kok-choynak": {
      name: "Ko'k naqshli choynak",
      short: "Qo'lda chizilgan klassik Rishton uslubidagi mayda choynak.",
      description:
        "Sof ozodalik va an'analar uyg'unligi. Choyxona uchun ideal — issiq saqlash va beshikni ko'tarib turuvchi mustahkam tutqich bilan.",
    },
    "ipak-ikat": {
      name: "Ipak ikat ro'mol",
      short: "Marg'ilon ustalari tomonidan an'anaviy abr-bandi usulida to'qilgan.",
      description:
        "100% tabiiy tut ipagi. Ranglar tabiiy bo'yoqlardan — anor po'sti, ko'k indigo, oltin qabuq. Har bir ro'mol uch usta nazoratida 21 kun mehnat mahsulidir.",
    },
    "lauh": {
      name: "Yog'och lauh kitobligi",
      short: "Xivada qo'lda o'yilgan, an'anaviy o'simlik motivlari bilan.",
      description:
        "Tut yog'ochidan, bir bo'lakdan o'yilgan. An'anaviy islimi naqshlar bilan bezatilgan, mum bilan pardozlangan. Quron yoki katta kitob uchun mukammal.",
    },
    "suzani": {
      name: "Suzani gilam panel",
      short: "Qizil va oltin ranglardagi an'anaviy suzani — devor uchun.",
      description:
        "Buxoro ayollari tomonidan qo'lda kashtalangan. Anor, gul va quyosh ramzlari bilan bezatilgan — uy, sevgi va baraka uchun an'anaviy in'om.",
    },
    "yog-chiroq": {
      name: "Bronza yog' chiroq",
      short: "X asr yog' chirog'i — antik bronza patinasi bilan.",
      description:
        "Qadimda Buxoro karvonsaroylarida ishlatilgan chiroq nusxasi. Qo'lda quyilgan bronza, sirpanma poydevor, dekorativ maqsadda.",
    },
    "registon-mini": {
      name: "Registon miniaturasi",
      short: "Samarqand Registonining detallashgan loy miniaturasi.",
      description:
        "Sherdor, Tillakori va Ulug'bek madrasalarining aniq nusxasi. Qo'lda bo'yalgan, har bir minora alohida shakllantirilgan. Ofis va uy uchun ajoyib esdalik.",
    },
    "kumush-uzuk": {
      name: "Kumush an'anaviy uzuk",
      short: "Markazida feruza — Buxoro ustalari tomonidan tayyorlangan.",
      description:
        "925 kumush, markazida tabiiy feruza. An'anaviy ko'z (nazar) ramzi — yomon ko'zdan himoya qiluvchi to'g'on.",
    },
    "loy-haykal": {
      name: "Sogd zodagonining haykali",
      short: "VIII asr Sogd zodagoni siymosining miniatura nusxasi.",
      description:
        "Afrosiyob qazilmalaridan topilgan terakota busti asosida tayyorlangan. Qo'lda shakllantirilgan, antik effekt bilan yakunlangan.",
    },
  },
  ru: {
    "rishton-lagan": {
      name: "Риштанское синее блюдо",
      short: "Традиционное блюдо в бирюзово-синих узорах — расписано вручную.",
      description:
        "Изготовлено мастерами Риштана по традиционной технике ишкорной глазури. Каждое блюдо уникально — расписывается вручную 14 дней по образу музейного экспоната.",
    },
    "samarkand-kosa": {
      name: "Самаркандская узорная пиала",
      short: "Золото и лазурь — вдохновлено дворцовой посудой XV века.",
      description:
        "Воссоздана современными мастерами по образу керамики дворца Амира Темура. Ручная работа, высокотемпературный обжиг, декор с символом из 24-каратного золота.",
    },
    "bukhara-marjon": {
      name: "Бухарское ожерелье филигрань",
      short: "Серебряная филигрань, красный агат и бирюза — из сокровищницы эмира.",
      description:
        "Серебро 925, красный агат и нишапурская бирюза. Реплика ожерелья из дворца бухарского эмира XIX века — каждый предмет сертифицирован.",
    },
    "bronza-chavandoz": {
      name: "Бронзовая статуэтка всадника",
      short: "Бронзовый образ воина Великого Шёлкового пути.",
      description:
        "Миниатюра бронзовой скульптуры I века из Термезского археологического музея. Ручное литьё, эффект античной патины, гранитная подставка в комплекте.",
    },
    "kok-choynak": {
      name: "Чайник с синим узором",
      short: "Расписан вручную в классическом риштанском стиле.",
      description:
        "Гармония простоты и традиций. Идеально для чайханы — сохраняет тепло, прочная ручка.",
    },
    "ipak-ikat": {
      name: "Шёлковый платок икат",
      short: "Соткан мастерами Маргилана по технике абрбанди.",
      description:
        "100% натуральный тутовый шёлк. Цвета — натуральные красители: гранатовая корка, индиго, золотая кора. Каждый платок — 21 день труда трёх мастеров.",
    },
    "lauh": {
      name: "Деревянная подставка лаух",
      short: "Резьба ручной работы из Хивы с растительными мотивами.",
      description:
        "Из цельного куска тутового дерева. Декорирована традиционным орнаментом ислими, покрыта воском. Идеально для Корана или большой книги.",
    },
    "suzani": {
      name: "Сюзане настенное панно",
      short: "Традиционное сюзане в красно-золотых тонах — для стены.",
      description:
        "Ручная вышивка бухарских мастериц. Символы граната, цветка и солнца — традиционный подарок к дому, любви и достатку.",
    },
    "yog-chiroq": {
      name: "Бронзовая масляная лампа",
      short: "Масляный светильник X века — с патиной античной бронзы.",
      description:
        "Реплика лампы, использовавшейся в бухарских караван-сараях. Ручное литьё, скрытое основание, декоративное назначение.",
    },
    "registon-mini": {
      name: "Миниатюра Регистана",
      short: "Детализированная глиняная миниатюра Самаркандского Регистана.",
      description:
        "Точная копия медресе Шердор, Тилля-Кари и Улугбек. Ручная роспись, каждая башня сформирована отдельно. Прекрасный сувенир для дома и офиса.",
    },
    "kumush-uzuk": {
      name: "Серебряное традиционное кольцо",
      short: "В центре — бирюза, изготовлено мастерами Бухары.",
      description:
        "Серебро 925, в центре натуральная бирюза. Традиционный символ «глаза» — оберег от сглаза.",
    },
    "loy-haykal": {
      name: "Скульптура согдийского вельможи",
      short: "Миниатюрная копия образа согдийского вельможи VIII века.",
      description:
        "Создана по образу терракотового бюста, найденного при раскопках Афрасиаба. Ручная лепка, эффект античности.",
    },
  },
  en: {
    "rishton-lagan": {
      name: "Rishton blue plate",
      short: "A traditional plate in turquoise and blue patterns — hand-painted.",
      description:
        "Made by famous masters of Rishton using traditional ishkor glaze. Each plate is unique — hand-decorated for 14 days following an ancient museum artifact.",
    },
    "samarkand-kosa": {
      name: "Samarkand patterned bowl",
      short: "A gold-and-azure bowl inspired by 15th-century palace ware.",
      description:
        "Reproduced by modern masters from ceramics of Amir Temur's palace. Hand-made, high-fired, decorated with a 24-karat gold motif.",
    },
    "bukhara-marjon": {
      name: "Bukhara filigree necklace",
      short: "Silver filigree, red agate and turquoise — from the emir's treasury.",
      description:
        "Sterling 925 silver, red agate and Nishapur turquoise. A replica of a necklace from the 19th-century Bukhara emir's palace — each piece is certified.",
    },
    "bronza-chavandoz": {
      name: "Bronze horseman figurine",
      short: "A bronze image of a Silk Road warrior.",
      description:
        "Miniature of a 1st-century bronze sculpture from the Termez Archaeological Museum. Hand-cast, antique patina finish, comes with a granite base.",
    },
    "kok-choynak": {
      name: "Blue-patterned teapot",
      short: "A small teapot hand-painted in the classic Rishton style.",
      description:
        "A harmony of simplicity and tradition. Ideal for chaikhana — keeps heat well with a strong handle.",
    },
    "ipak-ikat": {
      name: "Silk ikat scarf",
      short: "Woven by Margilan masters in the traditional abr-bandi technique.",
      description:
        "100% natural mulberry silk. Colors come from natural dyes — pomegranate peel, indigo, golden bark. Each scarf is 21 days of work by three masters.",
    },
    "lauh": {
      name: "Wooden lauh book stand",
      short: "Hand-carved in Khiva with traditional plant motifs.",
      description:
        "Carved from a single piece of mulberry wood. Decorated with traditional islimi ornaments, finished with wax. Perfect for the Quran or a large book.",
    },
    "suzani": {
      name: "Suzani wall panel",
      short: "A traditional suzani in red and gold — for the wall.",
      description:
        "Hand-embroidered by Bukhara women. Decorated with pomegranate, flower and sun symbols — a traditional gift for home, love and blessings.",
    },
    "yog-chiroq": {
      name: "Bronze oil lamp",
      short: "A 10th-century oil lamp — with antique bronze patina.",
      description:
        "A replica of a lamp once used in Bukhara caravanserais. Hand-cast bronze, recessed base, decorative purpose.",
    },
    "registon-mini": {
      name: "Registan miniature",
      short: "A detailed clay miniature of Samarkand's Registan.",
      description:
        "An accurate copy of the Sherdor, Tilla-Kari and Ulugbek madrasas. Hand-painted, each minaret shaped separately. A great keepsake for home and office.",
    },
    "kumush-uzuk": {
      name: "Silver traditional ring",
      short: "Turquoise in the center — made by masters of Bukhara.",
      description:
        "925 silver with natural turquoise. The traditional 'eye' symbol — an amulet against the evil eye.",
    },
    "loy-haykal": {
      name: "Sogdian noble sculpture",
      short: "A miniature copy of an 8th-century Sogdian noble.",
      description:
        "Made after the terracotta bust found at the Afrasiab excavations. Hand-modeled, finished with an antique effect.",
    },
  },
};

export const MUSEUM_T: Record<Lang, Record<string, MuseumT>> = {
  uz: {
    "amir-temur": {
      name: "Amir Temur muzeyi",
      city: "Toshkent",
      short: "Buyuk Sohibqiron va temuriylar saltanati merosi.",
      description:
        "1996-yilda tashkil etilgan muzey Amir Temur va temuriylar davriga oid 3000 dan ortiq nodir eksponatni o'z ichiga oladi.",
      founded: "1996",
    },
    "history-uz": {
      name: "O'zbekiston Tarixi davlat muzeyi",
      city: "Toshkent",
      short: "O'zbekiston tarixining 1.5 million yillik xronikasi.",
      description:
        "Markaziy Osiyoning eng yirik tarix muzeyi. Sak va Sogdlar davridan to bugungi kungacha bo'lgan davr eksponatlari.",
      founded: "1876",
    },
    savitsky: {
      name: "Savitskiy muzeyi",
      city: "Nukus",
      short: "\"Sahrodagi Luvr\" — sovet avangardi noyob kolleksiyasi.",
      description:
        "Igor Savitskiy tomonidan yig'ilgan dunyodagi eng katta sovet avangardi va Qoraqalpog'iston san'ati kolleksiyasi.",
      founded: "1966",
    },
    "bukhara-ark": {
      name: "Buxoro Ark muzeyi",
      city: "Buxoro",
      short: "Buxoro amirlari saroyi — VIII asrdan beri saqlangan qal'a.",
      description:
        "Buxoroning eng qadimiy yodgorligi. Amirlar saroyi, taxt zali, miniatyura kolleksiyasi va qo'lyozmalar saqlanadi.",
      founded: "VIII asr",
    },
  },
  ru: {
    "amir-temur": {
      name: "Музей Амира Темура",
      city: "Ташкент",
      short: "Наследие Великого Сахибкирана и империи Темуридов.",
      description:
        "Основанный в 1996 году музей содержит более 3000 редчайших экспонатов эпохи Амира Темура и Темуридов.",
      founded: "1996",
    },
    "history-uz": {
      name: "Государственный музей истории Узбекистана",
      city: "Ташкент",
      short: "Хроника 1,5 миллиона лет истории Узбекистана.",
      description:
        "Крупнейший исторический музей Центральной Азии. Экспонаты от эпохи саков и согдийцев до наших дней.",
      founded: "1876",
    },
    savitsky: {
      name: "Музей Савицкого",
      city: "Нукус",
      short: "«Лувр в пустыне» — уникальная коллекция советского авангарда.",
      description:
        "Крупнейшая в мире коллекция советского авангарда и каракалпакского искусства, собранная Игорем Савицким.",
      founded: "1966",
    },
    "bukhara-ark": {
      name: "Музей Бухарской цитадели Арк",
      city: "Бухара",
      short: "Дворец бухарских эмиров — крепость, сохранившаяся с VIII века.",
      description:
        "Древнейший памятник Бухары. Здесь сохранены дворец эмиров, тронный зал, коллекция миниатюр и рукописи.",
      founded: "VIII век",
    },
  },
  en: {
    "amir-temur": {
      name: "Amir Temur Museum",
      city: "Tashkent",
      short: "Heritage of the Great Sahibkiran and the Timurid empire.",
      description:
        "Founded in 1996, the museum holds over 3,000 rare exhibits from the era of Amir Temur and the Timurids.",
      founded: "1996",
    },
    "history-uz": {
      name: "State Museum of History of Uzbekistan",
      city: "Tashkent",
      short: "A 1.5-million-year chronicle of Uzbekistan's history.",
      description:
        "The largest history museum in Central Asia. Exhibits from the Saka and Sogdian eras to the present day.",
      founded: "1876",
    },
    savitsky: {
      name: "Savitsky Museum",
      city: "Nukus",
      short: "\"The Louvre in the desert\" — a unique Soviet avant-garde collection.",
      description:
        "The world's largest collection of Soviet avant-garde and Karakalpak art, gathered by Igor Savitsky.",
      founded: "1966",
    },
    "bukhara-ark": {
      name: "Bukhara Ark Museum",
      city: "Bukhara",
      short: "The palace of the Bukhara emirs — a fortress preserved since the 8th century.",
      description:
        "Bukhara's oldest landmark. The emirs' palace, the throne hall, miniature collection and manuscripts are preserved here.",
      founded: "8th century",
    },
  },
};

export const BLOG_T: Record<Lang, Record<string, BlogT>> = {
  uz: {
    "rishton-keramikasi": {
      title: "Rishton keramikasi: ko'k naqshlar tilidagi rivoyat",
      excerpt:
        "Bir tutam loy va to'rt rangli sir — Rishton ustalari ming yildan beri qanday qilib tarixni saqlab kelmoqda.",
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
    "registon-sirlari": {
      title: "Registon sirlari: madrasalar tilshunosligi",
      excerpt:
        "Samarqand markazida joylashgan uch madrasa — bu shunchaki bino emas, balki butun bir falsafa.",
      category: "Tarix",
      date: "28 Fevral, 2026",
      readTime: "8 daqiqa",
      body: [
        "Registon — \"qumli joy\" degan ma'noni anglatadi. Aslida bu Samarqandning ilm va savdo markazi edi.",
        "Ulug'bek madrasasi (1417), Sherdor (1636) va Tillakori (1660) — har biri o'z davrining me'morchilik va kalligrafiya cho'qqisi.",
        "Sherdor peshtoqidagi sherlar — islom an'anasidagi taqiqqa qarshi noyob hodisa. Bu temuriylar davrining erkin ruhini namoyish etadi.",
      ],
    },
    "ipak-yoli-toqimasi": {
      title: "Ipak yo'li to'qimasi: Marg'ilonning 2000 yillik ovozi",
      excerpt:
        "Marg'ilon abr-bandi — bulutlardan to'qilgan mato. Bu noyob texnika qanday saqlanib qolgan?",
      category: "An'analar",
      date: "14 Fevral, 2026",
      readTime: "5 daqiqa",
      body: [
        "Abr-bandi — \"bulutlarni bog'lash\" degan ma'noni beradi. Bu — iplarni bo'yashdan oldin maxsus bog'lash usuli.",
        "Marg'ilon ustalari ming yildan ortiq vaqt davomida bu sirni o'zgartirmadi. Tabiiy bo'yoqlar, qo'l mehnati va sabr — uchta asosiy uslub.",
        "Bir ko'ylaklik mato uchun 6 oy ish kerak bo'ladi. Ammo natija — bu butun umrga yetadigan asar.",
      ],
    },
    "buxoro-zargarligi": {
      title: "Buxoro zargarligi: filigranning sirli san'ati",
      excerpt: "Kumushdan o'rilgan dantela — Buxoro zargarlari mahoratining asosi.",
      category: "San'at",
      date: "30 Yanvar, 2026",
      readTime: "7 daqiqa",
      body: [
        "Filigran — bu juda nozik kumush tellardan yasalgan zargarlik buyumlari. Buxoro filigrani — Markaziy Osiyodagi eng nozik va nafis hisoblanadi.",
        "Har bir uzuk, marjon va sirg'a — usta tomonidan haftalar davomida qo'lda yig'iladi. Bir gramm kumushdan 50 metr tel cho'ziladi.",
        "Feruza, agat va marjon toshlari bilan birikma — bu insonni yomon nazardan saqlovchi an'anaviy kompozitsiya.",
      ],
    },
  },
  ru: {
    "rishton-keramikasi": {
      title: "Риштанская керамика: легенда на языке синих узоров",
      excerpt:
        "Горсть глины и четырёхцветная глазурь — как мастера Риштана хранят историю уже тысячу лет.",
      category: "Ремёсла",
      date: "12 марта 2026",
      readTime: "6 минут",
      body: [
        "Маленький город в Ферганской долине — Риштан — с XI века стал известнейшим центром керамики Центральной Азии.",
        "Местная красная глина и минералы Чаткальских гор дают все компоненты для особой глазури «ишкор». Из неё рождаются самые красивые синие и бирюзовые цвета.",
        "Сегодня мастера Риштана сохраняют традиционные технологии, включённые в список UNESCO. Каждое блюдо, пиала и кувшин расписываются вручную и обжигаются в дровяной печи 14 часов.",
        "Каждый риштанский предмет в нашей коллекции — от семьи мастеров в 4-м поколении и сопровождается сертификатом соответствия музейному оригиналу.",
      ],
    },
    "registon-sirlari": {
      title: "Тайны Регистана: язык медресе",
      excerpt:
        "Три медресе в центре Самарканда — это не просто здания, а целая философия.",
      category: "История",
      date: "28 февраля 2026",
      readTime: "8 минут",
      body: [
        "Регистан означает «песчаное место». На самом деле это был центр науки и торговли Самарканда.",
        "Медресе Улугбека (1417), Шердор (1636) и Тилля-Кари (1660) — каждое — вершина архитектуры и каллиграфии своей эпохи.",
        "Львы на портале Шердор — редкое явление вопреки исламскому запрету. Это показывает свободный дух эпохи Темуридов.",
      ],
    },
    "ipak-yoli-toqimasi": {
      title: "Ткань Шёлкового пути: 2000-летний голос Маргилана",
      excerpt:
        "Маргиланский абрбанди — ткань, сотканная из облаков. Как сохранилась эта уникальная техника?",
      category: "Традиции",
      date: "14 февраля 2026",
      readTime: "5 минут",
      body: [
        "Абрбанди означает «связывание облаков». Это особый способ перевязывания нитей перед окраской.",
        "Мастера Маргилана не меняли этот секрет более тысячи лет. Натуральные красители, ручной труд и терпение — три кита техники.",
        "На ткань для одной рубашки уходит 6 месяцев. Но результат — произведение на всю жизнь.",
      ],
    },
    "buxoro-zargarligi": {
      title: "Бухарское ювелирное искусство: тайна филиграни",
      excerpt: "Кружево из серебра — основа мастерства бухарских ювелиров.",
      category: "Искусство",
      date: "30 января 2026",
      readTime: "7 минут",
      body: [
        "Филигрань — это украшения из тончайших серебряных нитей. Бухарская филигрань — самая тонкая и изящная в Центральной Азии.",
        "Каждое кольцо, ожерелье и серьга собираются мастером вручную неделями. Из одного грамма серебра вытягивается 50 метров нити.",
        "Сочетание с бирюзой, агатом и кораллом — традиционная композиция-оберег от сглаза.",
      ],
    },
  },
  en: {
    "rishton-keramikasi": {
      title: "Rishton ceramics: a legend in the language of blue patterns",
      excerpt:
        "A handful of clay and a four-color glaze — how Rishton masters have kept history alive for a thousand years.",
      category: "Crafts",
      date: "March 12, 2026",
      readTime: "6 min",
      body: [
        "A small city in the Fergana Valley — Rishton — has been Central Asia's most famous ceramics center since the 11th century.",
        "Local red clay and minerals from the Chatkal mountains provide all the components for the special 'ishkor' glaze. The most beautiful blue and turquoise colors are born from it.",
        "Today the masters of Rishton preserve traditional techniques inscribed by UNESCO. Each plate, bowl and jug is hand-painted and fired in a wood kiln for 14 hours.",
        "Every Rishton piece in our collection comes from a 4th-generation family of masters and includes a certificate of accuracy to the museum exhibit.",
      ],
    },
    "registon-sirlari": {
      title: "Secrets of Registan: the language of madrasas",
      excerpt:
        "Three madrasas in the heart of Samarkand — not just buildings, but a whole philosophy.",
      category: "History",
      date: "February 28, 2026",
      readTime: "8 min",
      body: [
        "Registan means \"sandy place\". It was actually the center of science and trade in Samarkand.",
        "Ulugbek madrasa (1417), Sherdor (1636) and Tilla-Kari (1660) — each is the architectural and calligraphic peak of its time.",
        "The lions on Sherdor's portal are a rare phenomenon against the Islamic prohibition. They reflect the free spirit of the Timurid era.",
      ],
    },
    "ipak-yoli-toqimasi": {
      title: "Silk Road fabric: Margilan's 2000-year voice",
      excerpt:
        "Margilan abr-bandi — fabric woven from clouds. How has this unique technique survived?",
      category: "Traditions",
      date: "February 14, 2026",
      readTime: "5 min",
      body: [
        "Abr-bandi means \"binding clouds\". It is a special way of tying threads before dyeing.",
        "Margilan masters have not changed this secret for over a thousand years. Natural dyes, handwork and patience — the three pillars.",
        "Fabric for one shirt takes 6 months of work. But the result is a piece for a lifetime.",
      ],
    },
    "buxoro-zargarligi": {
      title: "Bukhara jewelry: the secret art of filigree",
      excerpt: "Lace woven from silver — the foundation of Bukhara jewelers' mastery.",
      category: "Art",
      date: "January 30, 2026",
      readTime: "7 min",
      body: [
        "Filigree is jewelry made of the finest silver threads. Bukhara filigree is considered the most delicate and refined in Central Asia.",
        "Each ring, necklace and earring is assembled by the master by hand over weeks. One gram of silver is drawn into 50 meters of thread.",
        "The combination with turquoise, agate and coral is a traditional amulet against the evil eye.",
      ],
    },
  },
};

// Category translation: map canonical Uzbek category -> per-lang label
export const CATEGORY_KEY: Record<string, string> = {
  Keramika: "cat.ceramics",
  Zargarlik: "cat.jewelry",
  Haykallar: "cat.statues",
  "Milliy naqshlar": "cat.patterns",
  Barchasi: "cat.all",
};