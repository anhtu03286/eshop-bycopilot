import argon2 from "argon2";
import crypto from "crypto";
import { sign, verify, type JwtPayload, type SignOptions } from "jsonwebtoken";
import { prisma } from "../../infrastructure/db/prisma";
import { env } from "../../shared/config/env";
import { AppError } from "../../shared/errors";
import { parseDurationToMs } from "../../shared/time";

type UserRole = "CUSTOMER" | "ADMIN";
type AuthUser = {
  id: string;
  role: UserRole;
};

type AuthTokenSet = {
  accessToken: string;
  refreshToken: string;
};

function buildAccessToken(user: AuthUser): string {
  return sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_ACCESS_TTL as SignOptions["expiresIn"],
  });
}

function buildRefreshToken(user: AuthUser, jti: string): string {
  return sign({ role: user.role }, env.JWT_REFRESH_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_REFRESH_TTL as SignOptions["expiresIn"],
    jwtid: jti,
  });
}

async function persistRefreshToken(jti: string, token: string, userId: string): Promise<void> {
  const tokenHash = await argon2.hash(token);
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_TTL));

  await prisma.refreshToken.create({
    data: {
      id: jti,
      tokenHash,
      userId,
      expiresAt,
    },
  });
}

async function issueTokens(user: AuthUser): Promise<AuthTokenSet> {
  const jti = crypto.randomUUID();
  const accessToken = buildAccessToken(user);
  const refreshToken = buildRefreshToken(user, jti);
  await persistRefreshToken(jti, refreshToken, user.id);
  return { accessToken, refreshToken };
}

export async function register(email: string, password: string, role: UserRole = "CUSTOMER"): Promise<AuthTokenSet> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email is already in use", 409);
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  return issueTokens(user);
}

export async function login(email: string, password: string): Promise<AuthTokenSet> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is disabled", 403);
  }

  const matches = await argon2.verify(user.passwordHash, password);
  if (!matches) {
    throw new AppError("Invalid credentials", 401);
  }

  return issueTokens(user);
}

export async function refresh(refreshToken: string): Promise<AuthTokenSet> {
  let payload: JwtPayload;
  try {
    payload = verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const jti = payload.jti;
  const userId = payload.sub;

  if (!jti || !userId) {
    throw new AppError("Invalid refresh token", 401);
  }

  const stored = await prisma.refreshToken.findUnique({ where: { id: String(jti) } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError("Refresh token revoked", 401);
  }

  const matches = await argon2.verify(stored.tokenHash, refreshToken);
  if (!matches) {
    throw new AppError("Refresh token mismatch", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: String(userId) } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User account is disabled", 403);
  }

  await prisma.refreshToken.update({
    where: { id: String(jti) },
    data: { revokedAt: new Date() },
  });

  return issueTokens(user);
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    const payload = verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    if (payload.jti) {
      await prisma.refreshToken.updateMany({
        where: { id: String(payload.jti), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  } catch {
    return;
  }
}

export async function getMe(userId: string): Promise<{
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
