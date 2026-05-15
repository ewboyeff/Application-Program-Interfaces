import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";
import adminRouter from "./routes/admin";
import bot from "./bot";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json());

// Static: rasm fayllari
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Start server
app.listen(PORT, () => {
  console.log(`✅ API server: http://localhost:${PORT}`);
});

// Start Telegram bot
bot.launch().then(() => {
  console.log("✅ Telegram bot ishga tushdi");
}).catch((err) => {
  console.error("❌ Bot xatosi:", err.message);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
