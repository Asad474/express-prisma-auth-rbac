import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '../generated/prisma';
import { mainRouter } from './api/v1/modules/index.router';
import errorMiddleware from './middleware/error';
import httpLogger from './middleware/httpLogger';
import { loadSwaggerSpec } from './swagger/swagger';

const createApp = (prisma: PrismaClient): Express => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieParser());

  app.use(httpLogger);

  const swaggerSpec = loadSwaggerSpec();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1', mainRouter(prisma));

  app.use(errorMiddleware);

  return app;
};

export default createApp;
