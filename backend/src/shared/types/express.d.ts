import type { AuthUser } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export {};
