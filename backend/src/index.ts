import { createApp } from "./app";
import { prisma } from "./infrastructure/db/prisma";
import { env } from "./shared/config/env";
import { logger } from "./shared/logger";

const app = createApp();

async function start() {
  try {
    await prisma.$connect();
    app.listen(env.PORT, () => {
      logger.info(`Backend listening on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}

void start();
