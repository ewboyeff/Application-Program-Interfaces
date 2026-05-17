import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/i18n/i18n";
import { BookOpen, Award, Users, Building2, ExternalLink } from "lucide-react";
import temur from "@/assets/museum-temur.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Biz haqimizda — Museum Shop" },
      { name: "description", content: "Museum Shop Uzbekistan haqida — maqsadimiz, jamoamiz va huquqiy asos." },
    ],
  }),
  component: AboutPage,
});

const DECREE_POINTS = [
  "Muzeylarda suvenir do'koni, hunarmandlar ustaxonasi va savdo shoxobchalarini tashkil etish.",
  "Noyob muzey ashyolari replikatsiyalarini tayyorlash va suvenir sifatida sotish (2022–2026).",
  "Mahalliy hunarmandlar ijodini muzeylar orqali jahon bozoriga chiqarish.",
  "Muzey eksponatlariga asoslangan raqamli katalog va marketing materiallarini yaratish.",
  "Suvenir savdosi orqali muzeylar moliyaviy mustaqilligini kuchaytirish.",
];

function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background" style={{ paddingTop: "calc(80px + 2rem)" }}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-ember opacity-35" />
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10">
          <p className="eyebrow">{t("nav.about")}</p>
          <h1 className="mt-2 max-w-2xl font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            O'zbekiston merosini{" "}
            <span className="italic text-primary">dunyo bilan ulash</span>
          </h1>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-foreground/65 sm:text-sm">
            Muzey eksponatlari va mohir hunarmandlar bilan hamkorlikda yaratilgan autentik mahsulotlar.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-card/30 py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Building2, value: "14", label: "Hamkor muzey" },
              { icon: Users, value: "80+", label: "Mahalliy usta" },
              { icon: Award, value: "120+", label: "Mahsulot turi" },
              { icon: BookOpen, value: "2022", label: "Prezident qarori" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
                <div className="mt-1.5 font-serif text-2xl text-primary">{value}</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decree — featured */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-2xl border border-primary/20 bg-card/50 p-6 lg:p-8">

            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">O'zR Prezidentining Qarori</p>
                  <p className="font-serif text-lg text-foreground">
                    PQ-261-son <span className="text-sm font-sans text-muted-foreground">· 2022-yil 27-may</span>
                  </p>
                </div>
              </div>
              <a
                href="https://lex.uz/uz/docs/-6040013"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-smooth hover:bg-primary/20"
              >
                <ExternalLink className="h-3 w-3" />
                Lex.uz'da o'qish
              </a>
            </div>

            {/* Title */}
            <p className="mt-4 font-serif text-base font-semibold text-foreground sm:text-lg">
              Muzeylarda xizmatlar sohasini rivojlantirish chora-tadbirlari to'g'risida
            </p>

            {/* 2-col: preamble + points */}
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3 text-xs leading-relaxed text-foreground/65">
                <p>
                  Ushbu qarorda davlat muzeylari faoliyatini modernizatsiya qilish, xizmatlar ko'lamini kengaytirish hamda innovatsion yondashuvlarni joriy etish ustuvor vazifa sifatida belgilangan. Muzeylarning marketing siyosatini takomillashtirish, zamonaviy ekspozitsiyalar va noyob ashyolar replikatsiyalarini yaratish nazarda tutilgan.
                </p>
                <p>
                  1-ilovaga muvofiq davlat muzeylarida muzey mahsulotlari va replikatsiyalarini sotishga ixtisoslashtirilgan onlayn do'konlarni tashkil etish belgilab berilgan.
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Asosiy yo'nalishlar</p>
                <ul className="mt-3 space-y-2">
                  {DECREE_POINTS.map((text, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 grid h-4 w-4 place-items-center rounded-full border border-primary/40 bg-primary/10 text-[9px] font-semibold text-primary">
                        {i + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-foreground/65">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-5 flex flex-col gap-2 border-t border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-xs text-muted-foreground">O'zbekiston Respublikasi Prezidenti</p>
                <p className="font-serif text-sm italic text-primary">Sh. Mirziyoyev</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Toshkent, 2022-yil 27-may</p>
            </div>
          </div>
        </div>
      </section>

      {/* About text + image */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">— Bizning maqsadimiz</p>
              <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
                Tarixni <span className="italic text-primary">qo'lga olamiz</span>
              </h2>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-foreground/65 sm:text-sm">
                <p>
                  Museum Shop Uzbekistan 2019-yilda O'zbekiston Respublikasi Madaniyat vazirligi bilan hamkorlikda tashkil etilgan. Maqsadimiz — muzey eksponatlarini ilhom manbai sifatida ishlatib, mahalliy hunarmandlar bilan sifatli mahsulotlar yaratish.
                </p>
                <p>
                  Har bir buyum muzey kuratorlari nazoratida tayyorlanadi. Sertifikat, kelib chiqish hikoyasi va hunarmand ismi bilan birga keladi.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-card">
              <img src={temur} alt="Museum Shop" className="aspect-[16/9] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
