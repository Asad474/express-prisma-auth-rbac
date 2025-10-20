import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authRouter } from './auth/auth.route';

export const mainRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.use('/auth', authRouter(prisma));

  return router;
};
