import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "@/components/site/Toaster";
import { useI18n } from "@/i18n/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Aloqa — Museum Shop" },
      {
        name: "description",
        content: "Toshkent, Samarqand va Buxorodagi bizning manzillarimiz.",
      },
      { property: "og:title", content: "Aloqa — Museum Shop" },
      { property: "og:description", content: "Biz bilan bog'laning." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const { t } = useI18n();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast(t("toast.messageSent"));
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader
        eyebrow={t("contact.headerEyebrow")}
        title={t("contact.headerTitle")}
        highlight={t("contact.headerHighlight")}
        subtitle={t("contact.headerSub")}
      />

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_440px] lg:px-10">
          {/* Form + Map */}
          <div className="space-y-8">
            <form
              onSubmit={submit}
              className="rounded-2xl border border-border/60 bg-card/60 p-7 shadow-card lg:p-10"
            >
              <p className="eyebrow">{t("contact.formEyebrow")}</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                {t("contact.formTitle1")} <span className="italic text-primary">{t("contact.formTitle2")}</span>
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={t("contact.name")} required>
                  <input
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder={t("contact.namePh")}
                    className="input"
                  />
                </Field>
                <Field label={t("contact.phone")} required>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+998 90 123 45 67"
                    className="input"
                  />
                </Field>
                <Field label={t("contact.email")} className="sm:col-span-2">
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder={t("contact.emailPh")}
                    className="input"
                  />
                </Field>
                <Field label={t("contact.message")} className="sm:col-span-2" required>
                  <textarea
                    required
                    value={form.message}
                    onChange={update("message")}
                    rows={5}
                    placeholder={t("contact.messagePh")}
                    className="input resize-none"
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
              >
                {t("contact.send")}
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Map placeholder */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-card">
              <div className="aspect-[16/9] w-full bg-[radial-gradient(ellipse_at_center,oklch(0.22_0.012_60)_0%,oklch(0.14_0.005_60)_70%)]">
                <svg
                  viewBox="0 0 800 450"
                  className="h-full w-full opacity-40"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="oklch(0.75 0.09 80)"
                        strokeOpacity="0.25"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="450" fill="url(#grid)" />
                  <path
                    d="M0 280 Q 200 200 400 240 T 800 220"
                    stroke="oklch(0.75 0.09 80)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M150 0 Q 200 200 400 240 T 600 450"
                    stroke="oklch(0.78 0.16 65)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-gradient-gold shadow-glow">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </span>
                <p className="mt-4 font-serif text-2xl">{t("contact.city")}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("contact.address")}
                </p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <aside className="space-y-4">
            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              title={t("contact.info.address")}
              lines={[t("contact.addrLine1"), t("contact.addrLine2")]}
            />
            <InfoCard
              icon={<Phone className="h-4 w-4" />}
              title={t("contact.info.phone")}
              lines={["+998 71 123 45 67", "+998 90 123 45 67"]}
            />
            <InfoCard
              icon={<Mail className="h-4 w-4" />}
              title={t("contact.info.email")}
              lines={["hello@museumshop.uz", "press@museumshop.uz"]}
            />
            <InfoCard
              icon={<Clock className="h-4 w-4" />}
              title={t("contact.info.hours")}
              lines={[t("contact.hours1"), t("contact.hours2")]}
            />
          </aside>
        </div>
      </section>

      <Footer />

      <style>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: var(--foreground);
          outline: none;
          transition: border-color 240ms;
        }
        .input:focus { border-color: var(--primary); }
        .input::placeholder { color: var(--muted-foreground); }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label} {required ? <span className="text-accent">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 transition-smooth hover:border-primary/40">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 text-primary">
          {icon}
        </span>
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}