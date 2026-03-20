import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { env } from "./shared/config/env";
import { errorHandler } from "./shared/middleware/error-handler";
import { notFound } from "./shared/middleware/not-found";
import { logger } from "./shared/logger";
import routes from "./routes";

export function createApp() {
  const app = express();
  const allowedOrigins = [env.CLIENT_ORIGIN, env.ADMIN_ORIGIN].filter((origin): origin is string => Boolean(origin));

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("CORS origin not allowed"));
      },
      credentials: true,
    }),
  );

  app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }));
  app.use(express.json());

  app.use(
    "/api/v1/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 50,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use("/api/v1", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
