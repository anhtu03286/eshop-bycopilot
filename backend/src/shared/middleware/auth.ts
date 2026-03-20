import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../../infrastructure/db/prisma";

export type AuthUser = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing access token" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    const userId = String(payload.sub);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });

    if (!user || !user.isActive) {
      res.status(403).json({ error: "User account is disabled" });
      return;
    }

    req.auth = {
      userId,
      role: payload.role as AuthUser["role"],
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired access token" });
  }
}

export function requireRole(role: AuthUser["role"]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: "Unauthenticated" });
      return;
    }

    if (req.auth.role !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
