# 🎨 AI Voice Painter (Ovozli Rassom)

Bu loyiha **Next.js** asosida qurilgan bo'lib, ovozli buyruqlarni sun'iy intellekt yordamida professional rasmlarga aylantirib beradi.

Loyiha **Backend-siz (Serverless)** ishlaydi. Ovoz brauzerning o'zida tahlil qilinadi, Prompt Groq AI orqali kuchaytiriladi va rasm Pollinations yordamida chiziladi.

## 🚀 Xususiyatlari

- 🎤 **Ovozdan Matnga:** `Web Speech API` yordamida to'g'ridan-to'g'ri brauzerda (ingliz tilida) gapirib yozish.
- 🧠 **AI Prompt Muhandisi:** Oddiy so'zni (masalan: "cat") **Groq (Llama 3.3)** yordamida professional promptga aylantirish (masalan: "Hyper-realistic cat sitting on a neon roof...").
- 🖼️ **Rasm Yaratish:** **Pollinations.ai** yordamida bepul va cheklovsiz rasm chizish.
- ⚡ **Tez va Yengil:** Hech qanday og'ir server yoki VPN talab qilinmaydi.
- 🛡️ **Xavfsiz:** API kalitlari `.env` faylda saqlanadi.

## 🛠️ Texnologiyalar

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Model:** [Groq Cloud](https://groq.com/) (Llama-3.3-70b)
- **Image Gen:** [Pollinations.ai](https://pollinations.ai/)
- **Icons:** React Icons

## 📦 O'rnatish va Ishga tushirish

Loyihani kompyuteringizda ishlatish uchun quyidagi qadamlarni bajaring:

### 1. Kutubxonalarni o'rnatish
Terminalni oching va kerakli paketlarni yuklab oling:

```bash
npm install