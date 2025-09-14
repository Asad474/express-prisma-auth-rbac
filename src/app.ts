import cookieParser from "cookie-parser";
import express from "express";

import { PrismaClient } from "../generated/prisma";
import { errorMiddleware, notFound } from "./middleware/error";
import { authRouter, userRouter } from "./routes";

const createApp = (prisma: PrismaClient) => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Middleware to parse cookies
  app.use(cookieParser());

  app.use("/api/auth", authRouter(prisma));
  app.use("/api/user", userRouter(prisma));

  // Middleware for handling errors and not found routes
  app.use(notFound);
  app.use(errorMiddleware);

  return app;
};

export default createApp;
