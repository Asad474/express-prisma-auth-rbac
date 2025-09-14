import { Router } from "express";

import { PrismaClient } from "../../generated/prisma";
import { userController } from "../controllers/user.controller";

const userRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", userController.getUser(prisma));
  router.patch("/", userController.updateUser(prisma));

  return router;
};

export default userRouter;
