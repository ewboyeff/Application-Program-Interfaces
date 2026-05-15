import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: { id: string; username: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token kerak" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string; role: string };
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
  }
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.admin?.role !== "superadmin") {
    return res.status(403).json({ error: "Ruxsat yo'q" });
  }
  next();
}
