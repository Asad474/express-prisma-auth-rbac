import { Router } from 'express';
import { authRouter } from './auth/auth.route';
import { PrismaClient } from '../../../../generated/prisma';

export const mainRouter = (prisma: PrismaClient): Router => {
  const router = Router();

  router.use('/auth', authRouter(prisma));

  return router;
};
