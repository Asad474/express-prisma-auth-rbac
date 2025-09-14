import { Router } from "express";

import { PrismaClient } from "../../generated/prisma";
import { authController } from "../controllers/auth.controller";
import { validateData } from "../middleware/validator";
import { authValidator } from "../validators/auth.validator";

const authRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.post(
    "/register",
    validateData(authValidator.registerUserSchema),
    authController.registerUser(prisma)
  );

  router.post(
    "/login",
    validateData(authValidator.loginUserSchema),
    authController.loginUser(prisma)
  );

  router.post("/logout", authController.logoutUser);

  return router;
};

export default authRouter;
