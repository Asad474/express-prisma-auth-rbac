import dotenv from 'dotenv';
import createApp from './app';
import logger from './logger';
import { AppError } from './utils/AppError';
import { prisma } from './utils/prismaClient';
dotenv.config();

const app = createApp(prisma);

const port = Number(process.env.PORT) || 8000;

process.on('uncaughtException', (error: AppError) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason: AppError) => {
  logger.error(`Unhandled Rejection: ${reason.message}`, {
    stack: reason.stack,
  });
  process.exit(1);
});

app.listen(port, () => {
  logger.info(`Server is listening at port ${port}`);
  logger.info(
    `API Documentation available at http://localhost:${port}/api-docs`,
  );
});
