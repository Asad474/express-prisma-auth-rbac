import { Request, Response } from "express";

import { PrismaClient } from "../../generated/prisma";

const getUser = (prisma: PrismaClient) => {
  return async (req: Request, res: Response) => {};
};

const updateUser = (prisma: PrismaClient) => {
  return async (req: Request, res: Response) => {};
};

export const userController = {
  getUser,
  updateUser,
};
