import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { authValidator } from './auth.validation';
import { PrismaClient } from '../../../../../generated/prisma';
import validateData from '../../../../middleware/validator';

export const authRouter = (prisma: PrismaClient): Router => {
  const authRouter = Router();
  const authRepositroy = new AuthRepository();
  const authService = new AuthService(authRepositroy);
  const authController = new AuthController(authService, prisma);

  authRouter.post(
    '/register',
    validateData(authValidator.registerUserSchema),
    authController.registerUser.bind(authController),
  );

  authRouter.post(
    '/login',
    validateData(authValidator.loginUserSchema),
    authController.loginUser.bind(authController),
  );

  authRouter.post('/logout', authController.logoutUser.bind(authController));

  return authRouter;
};
