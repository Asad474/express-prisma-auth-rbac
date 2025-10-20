import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { PrismaClient } from '../generated/prisma';
import { mainRouter } from './api/v1/modules/index.router';
import { errorMiddleware, notFound } from './middleware/error';

const createApp = (prisma: PrismaClient): Express => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieParser());

  app.use('/api/v1', mainRouter(prisma));

  app.use(notFound);
  app.use(errorMiddleware);

  return app;
};

export default createApp;
