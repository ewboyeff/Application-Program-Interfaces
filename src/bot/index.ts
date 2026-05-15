import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";
import axios from "axios";
import FormData from "form-data";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const API = process.env.API_URL || "http://localhost:4000";

// Telegram Markdown V1 uchun _ va * ni escape qilish (foydalanuvchi ma'lumotlari uchun)
function esc(text: string) {
  return text.replace(/[_*`[]/g, "\\$&");
}

// ── Session ──────────────────────────────────────────────────────────────────
interface Session {
  token: string;
  username: string;
  fullName: string;
  role: string;
}
const sessions = new Map<number, Session>();

// ── Flow states ───────────────────────────────────────────────────────────────
type AuthStep = "login_username" | "login_password" | "signup_fullName" | "signup_username" | "signup_password";
interface AuthDraft {
  step: AuthStep;
  fullName?: string;
  username?: string;
}
const authDrafts = new Map<number, AuthDraft>();

interface ProductDraft {
  step: string;
  imageFileId?: string;
  name?: string;
  price?: number;
  type?: "MOHIR_QOLLAR" | "MUZEY_SUVENIRLARI";
  category?: string;
  museumId?: string;
  short?: string;
}
const drafts = new Map<number, ProductDraft>();

interface RegDraft {
  step: "fullName" | "username" | "password";
  fullName?: string;
  username?: string;
}
const regDrafts = new Map<number, RegDraft>();

// ── Data ──────────────────────────────────────────────────────────────────────
const MUSEUMS = [
  { id: "davlat-sanat",     name: "O'zbekiston davlat San'at muzeyi" },
  { id: "tarix-davlat",     name: "O'zbekiston tarixi davlat muzeyi" },
  { id: "temuriylar-tarix", name: "Temuriylar tarixi davlat muzeyi" },
  { id: "amaliy-sanat",     name: "Amaliy san'at va hunarmandchilik muzeyi" },
  { id: "tabiat-davlat",    name: "O'zbekiston davlat tabiat muzeyi" },
  { id: "olimpiya-shuhrat", name: "Olimpiya va paralimpiya shon-shuhrati muzeyi" },
  { id: "behzod-miniatura", name: "Behzod nomidagi Sharq miniatura san'ati muzeyi" },
];

const MOHIR_CATS = [
  "Zargarlik buyumlari",
  "Sopol buyumlar",
  "Kiyimlar",
  "Shopperlar",
  "Yog'och o'ymakorligi",
  "Gilamalar",
  "Matolar",
  "Kashtachilik",
  "Miniatyuralar",
];
const MUZEY_CATS = [
  "Muzey ashyolari replikalari",
  "Kitoblar va kataloglar",
  "Bolalar uchun",
  "Bosma printli idishlar (muzey)",
  "Bosma printli kiyimlar",
  "Shopperlar (muzey)",
  "Otkritkalar",
  "Breloklar va magnitlar",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function mainMenu(name: string) {
  return (
    `Salom, ${esc(name)}! 👋\n\n` +
    `/add — yangi mahsulot qo'shish\n` +
    `/logout — tizimdan chiqish\n` +
    `/cancel — amalni bekor qilish`
  );
}

function clearAll(id: number) {
  authDrafts.delete(id);
  drafts.delete(id);
  regDrafts.delete(id);
}

// ── /start ────────────────────────────────────────────────────────────────────
bot.command("start", (ctx) => {
  const id = ctx.from?.id!;
  const session = sessions.get(id);
  if (session) {
    return ctx.reply(mainMenu(session.fullName || session.username));
  }
  clearAll(id);
  ctx.reply(
    `🏛 Museum Shop — sotuvchi boti\n\nMahsulot qo'shish uchun tizimga kiring yoki ro'yxatdan o'ting.`,
    {
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔑 Kirish", "auth_login")],
        [Markup.button.callback("📝 Ro'yxatdan o'tish", "auth_signup")],
      ]),
    },
  );
});

// ── Auth action buttons ───────────────────────────────────────────────────────
bot.action("auth_login", (ctx) => {
  const id = ctx.from?.id!;
  clearAll(id);
  authDrafts.set(id, { step: "login_username" });
  ctx.editMessageText("🔑 Loginingizni kiriting:");
});

bot.action("auth_signup", (ctx) => {
  const id = ctx.from?.id!;
  clearAll(id);
  authDrafts.set(id, { step: "signup_fullName" });
  ctx.editMessageText("📝 Ro'yxatdan o'tish\n\n👤 To'liq ismingizni kiriting:\n\nMasalan: Aziz Karimov");
});

// ── /login ────────────────────────────────────────────────────────────────────
bot.command("login", (ctx) => {
  const id = ctx.from?.id!;
  if (sessions.has(id)) return ctx.reply("✅ Siz allaqachon kirgansiz. /add — mahsulot qo'shish");
  clearAll(id);
  authDrafts.set(id, { step: "login_username" });
  ctx.reply("🔑 Loginingizni kiriting:");
});

// ── /logout ───────────────────────────────────────────────────────────────────
bot.command("logout", (ctx) => {
  const id = ctx.from?.id!;
  sessions.delete(id);
  clearAll(id);
  ctx.reply("👋 Tizimdan chiqdingiz.\n\n/start — qayta boshlash");
});

// ── /add ──────────────────────────────────────────────────────────────────────
bot.command("add", (ctx) => {
  const id = ctx.from?.id!;
  if (!sessions.has(id)) return ctx.reply("⛔ Avval tizimga kiring: /login");
  drafts.delete(id);
  drafts.set(id, { step: "photo" });
  ctx.reply("📸 Mahsulot rasmini yuboring.\n\nJPG yoki PNG formatda, aniq va sifatli rasm.");
});

// ── /register (superadmin: yangi sotuvchi yaratish) ───────────────────────────
bot.command("register", (ctx) => {
  const id = ctx.from?.id!;
  const session = sessions.get(id);
  if (!session) return ctx.reply("⛔ Avval tizimga kiring: /login");
  if (session.role !== "superadmin") return ctx.reply("⛔ Faqat superadmin yangi foydalanuvchi qo'sha oladi.");
  clearAll(id);
  regDrafts.set(id, { step: "fullName" });
  ctx.reply("👤 Yangi sotuvchining to'liq ismini kiriting:");
});

// ── /cancel ───────────────────────────────────────────────────────────────────
bot.command("cancel", (ctx) => {
  const id = ctx.from?.id!;
  clearAll(id);
  ctx.reply("❌ Bekor qilindi. /start — bosh menyu");
});

// ── Photo ─────────────────────────────────────────────────────────────────────
bot.on(message("photo"), async (ctx) => {
  const id = ctx.from?.id!;
  if (!sessions.has(id)) return;
  const draft = drafts.get(id);
  if (!draft || draft.step !== "photo") return;

  const photo = ctx.message.photo.at(-1)!;
  draft.imageFileId = photo.file_id;
  draft.step = "name";
  drafts.set(id, draft);
  ctx.reply("✅ Rasm qabul qilindi!\n\n✏️ Mahsulot nomini kiriting:");
});

// ── Text handler ──────────────────────────────────────────────────────────────
bot.on(message("text"), async (ctx) => {
  const id = ctx.from?.id!;
  const text = ctx.message.text.trim();

  // ── Auth flow ──────────────────────────────────────────────────────────────
  const auth = authDrafts.get(id);
  if (auth) {
    switch (auth.step) {

      case "login_username": {
        auth.username = text;
        auth.step = "login_password";
        authDrafts.set(id, auth);
        return ctx.reply("🔒 Parolingizni kiriting:");
      }

      case "login_password": {
        authDrafts.delete(id);
        try {
          const res = await axios.post(`${API}/api/auth/login`, {
            username: auth.username,
            password: text,
          });
          const { token, admin } = res.data;
          const name = admin.fullName || admin.username;
          sessions.set(id, { token, username: admin.username, fullName: name, role: admin.role });
          return ctx.reply(`✅ Xush kelibsiz, ${name}!\n\n` + mainMenu(name));
        } catch (err: any) {
          const msg = err.response?.data?.error || "Server xatosi";
          return ctx.reply(
            `❌ Kirish muvaffaqiyatsiz: ${msg}`,
            {
              ...Markup.inlineKeyboard([
                [Markup.button.callback("🔄 Qayta urinish", "auth_login")],
                [Markup.button.callback("📝 Ro'yxatdan o'tish", "auth_signup")],
              ]),
            },
          );
        }
      }

      case "signup_fullName": {
        if (text.length < 3) return ctx.reply("❗ Ism kamida 3 ta harf bo'lsin.");
        auth.fullName = text;
        auth.step = "signup_username";
        authDrafts.set(id, auth);
        return ctx.reply(
          "🔑 Login o'rnating\n\nFaqat kichik lotin harflari, raqam va _ belgisi (3-30 belgi)\n\nMasalan: aziz_karimov",
        );
      }

      case "signup_username": {
        if (!/^[a-z0-9_]{3,30}$/.test(text)) {
          return ctx.reply("❗ Login faqat kichik lotin harflari, raqam va _ (3-30 belgi). Qayta kiriting:");
        }
        auth.username = text;
        auth.step = "signup_password";
        authDrafts.set(id, auth);
        return ctx.reply("🔒 Parol o'rnating (kamida 6 ta belgi):");
      }

      case "signup_password": {
        if (text.length < 6) return ctx.reply("❗ Parol kamida 6 ta belgi bo'lishi kerak.");
        authDrafts.delete(id);
        try {
          const res = await axios.post(`${API}/api/auth/signup`, {
            fullName: auth.fullName,
            username: auth.username,
            password: text,
            telegramId: id,
          });
          const { token, admin } = res.data;
          const name = admin.fullName || auth.fullName!;
          sessions.set(id, { token, username: admin.username, fullName: name, role: admin.role });
          return ctx.reply(
            `✅ Ro'yxatdan o'tildi!\n\n` +
            `👤 Ism: ${auth.fullName}\n` +
            `🔑 Login: ${auth.username}\n\n` +
            mainMenu(name),
          );
        } catch (err: any) {
          const msg = err.response?.data?.error || "Server xatosi";
          if (err.response?.status === 409) {
            auth.step = "signup_username";
            authDrafts.set(id, auth);
            return ctx.reply(`❗ ${msg}\n\nBoshqa login kiriting:`);
          }
          return ctx.reply(`❌ Xatolik: ${msg}\n\n/start — qaytadan boshlash`);
        }
      }
    }
  }

  // ── Register flow (superadmin) ─────────────────────────────────────────────
  const regDraft = regDrafts.get(id);
  if (regDraft) {
    if (regDraft.step === "fullName") {
      regDraft.fullName = text;
      regDraft.step = "username";
      regDrafts.set(id, regDraft);
      return ctx.reply("🔑 Login kiriting (kichik lotin harflari, raqam, _):");
    }
    if (regDraft.step === "username") {
      if (!/^[a-z0-9_]{3,30}$/.test(text)) {
        return ctx.reply("❗ Login faqat kichik lotin harflari, raqam va _ (3-30 belgi).");
      }
      regDraft.username = text;
      regDraft.step = "password";
      regDrafts.set(id, regDraft);
      return ctx.reply("🔒 Parol o'rnating (kamida 6 ta belgi):");
    }
    if (regDraft.step === "password") {
      if (text.length < 6) return ctx.reply("❗ Parol kamida 6 ta belgi bo'lishi kerak.");
      regDrafts.delete(id);
      const session = sessions.get(id);
      if (!session) return ctx.reply("⛔ Sessiya tugagan. /login");
      try {
        await axios.post(
          `${API}/api/auth/register`,
          { username: regDraft.username, password: text, fullName: regDraft.fullName, secretKey: process.env.JWT_SECRET + "_admin" },
          { headers: { Authorization: `Bearer ${session.token}` } },
        );
        return ctx.reply(
          `✅ Sotuvchi yaratildi!\n\n👤 Ism: ${regDraft.fullName}\n🔑 Login: ${regDraft.username}\n🔒 Parol: ${text}\n\nUshbu ma'lumotlarni sotuvchiga yuboring.`,
        );
      } catch (err: any) {
        const msg = err.response?.data?.error || "Server xatosi";
        return ctx.reply(`❌ Xatolik: ${msg}`);
      }
    }
  }

  // ── Product add flow ───────────────────────────────────────────────────────
  const draft = drafts.get(id);
  if (!draft || !sessions.has(id)) return;

  switch (draft.step) {
    case "name": {
      draft.name = text;
      draft.step = "price";
      drafts.set(id, draft);
      ctx.reply("💰 Narxini kiriting (faqat raqam, so'mda):\n\nMasalan: 250000");
      break;
    }
    case "price": {
      const price = parseInt(text.replace(/\s/g, ""));
      if (isNaN(price) || price <= 0) return ctx.reply("❗ Faqat raqam kiriting. Masalan: 250000");
      draft.price = price;
      draft.step = "type";
      drafts.set(id, draft);
      ctx.reply(
        "📂 Asosiy kategoriyani tanlang:",
        {
          ...Markup.inlineKeyboard([
            [Markup.button.callback("🖐 Mohir Qo'llar", "type_MOHIR_QOLLAR")],
            [Markup.button.callback("🏛 Muzey Suvenirlari", "type_MUZEY_SUVENIRLARI")],
          ]),
        },
      );
      break;
    }
    case "short": {
      draft.short = text;
      if (draft.type === "MUZEY_SUVENIRLARI") {
        draft.step = "museum";
        drafts.set(id, draft);
        ctx.reply(
          "🏛 Qaysi muzeyga tegishli?",
          {
            ...Markup.inlineKeyboard(MUSEUMS.map((m) => [Markup.button.callback(m.name, `museum_${m.id}`)])),
          },
        );
      } else {
        draft.step = "confirm";
        draft.museumId = undefined;
        drafts.set(id, draft);
        showConfirm(ctx, draft);
      }
      break;
    }
  }
});

// ── Inline button handlers ────────────────────────────────────────────────────
bot.action(/^type_(.+)$/, (ctx) => {
  const id = ctx.from?.id!;
  const draft = drafts.get(id);
  if (!draft || !sessions.has(id)) return;
  draft.type = ctx.match[1] as "MOHIR_QOLLAR" | "MUZEY_SUVENIRLARI";
  draft.step = "category";
  drafts.set(id, draft);
  const cats = draft.type === "MOHIR_QOLLAR" ? MOHIR_CATS : MUZEY_CATS;
  ctx.editMessageText("📁 Pastki kategoriyani tanlang:", {
    ...Markup.inlineKeyboard(cats.map((c) => [Markup.button.callback(c, `cat_${c}`)])),
  });
});

bot.action(/^cat_(.+)$/, (ctx) => {
  const id = ctx.from?.id!;
  const draft = drafts.get(id);
  if (!draft || !sessions.has(id)) return;
  draft.category = ctx.match[1];
  draft.step = "short";
  drafts.set(id, draft);
  ctx.editMessageText("📝 Qisqa tavsif yozing (1-2 jumla, karta uchun):");
});

bot.action(/^museum_(.+)$/, (ctx) => {
  const id = ctx.from?.id!;
  const draft = drafts.get(id);
  if (!draft || !sessions.has(id)) return;
  draft.museumId = ctx.match[1];
  draft.step = "confirm";
  drafts.set(id, draft);
  ctx.deleteMessage().catch(() => {});
  showConfirm(ctx, draft);
});

function showConfirm(ctx: any, draft: ProductDraft) {
  const museumName = draft.museumId
    ? MUSEUMS.find((m) => m.id === draft.museumId)?.name || draft.museumId
    : null;
  ctx.reply(
    `✅ Mahsulot ma'lumotlari:\n\n` +
    `📛 Nomi: ${draft.name}\n` +
    `💰 Narxi: ${draft.price?.toLocaleString()} so'm\n` +
    `📂 Turi: ${draft.type === "MOHIR_QOLLAR" ? "Mohir Qo'llar" : "Muzey Suvenirlari"}\n` +
    `📁 Kategoriya: ${draft.category}\n` +
    (museumName ? `🏛 Muzey: ${museumName}\n` : "") +
    `📝 Tavsif: ${draft.short}\n\n` +
    `Tasdiqlaysizmi?`,
    {
      ...Markup.inlineKeyboard([
        [Markup.button.callback("✅ Ha, saqlash", "confirm_save")],
        [Markup.button.callback("❌ Bekor qilish", "confirm_cancel")],
      ]),
    },
  );
}

bot.action("confirm_save", async (ctx) => {
  const id = ctx.from?.id!;
  const draft = drafts.get(id);
  const session = sessions.get(id);
  if (!draft || !session) return;

  ctx.editMessageText("⏳ Saqlanmoqda...");

  try {
    const fileLink = await ctx.telegram.getFileLink(draft.imageFileId!);
    const imageRes = await new Promise<Buffer>((resolve, reject) => {
      https.get(fileLink.href, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      });
    });

    const form = new FormData();
    form.append("image", imageRes, { filename: `product-${Date.now()}.jpg`, contentType: "image/jpeg" });
    form.append("name_uz", draft.name!);
    form.append("price", String(draft.price));
    form.append("type", draft.type!);
    form.append("category", draft.category!);
    if (draft.museumId) form.append("museum_id", draft.museumId);
    form.append("short_uz", draft.short!);
    form.append("desc_uz", draft.short!);

    const apiRes = await axios.post(`${API}/api/products`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${session.token}` },
    });

    drafts.delete(id);
    ctx.editMessageText(`✅ Mahsulot qo'shildi!\n\nID: ${apiRes.data.id}\n\n/add — yana qo'shish`);
  } catch (err: any) {
    const status = err.response?.status;
    const msg = err.response?.data?.error || err.message || "Noma'lum xato";
    console.error("confirm_save error:", status, msg);
    if (status === 401) {
      sessions.delete(id);
      ctx.editMessageText("⛔ Sessiya muddati tugagan. /login buyrug'i bilan qayta kiring.");
    } else {
      ctx.editMessageText(`❌ Xatolik (${status || "network"}): ${msg}\n\n/add — qayta urinib ko'ring`);
    }
  }
});

bot.action("confirm_cancel", (ctx) => {
  const id = ctx.from?.id!;
  drafts.delete(id);
  ctx.editMessageText("❌ Bekor qilindi. /add — qaytadan boshlash.");
});

export default bot;
