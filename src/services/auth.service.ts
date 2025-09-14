import { Request } from "express";

import { PrismaClient } from "../../generated/prisma";
import { responseMessages } from "../common/constants/message";
import { AppError } from "../utils/AppError";
import { comparePassword } from "../utils/comparePassword";
import { generatePassword } from "../utils/generatePassword";
import { generateToken } from "../utils/generateToken";

const registerUserService = async (req: Request, prisma: PrismaClient) => {
  const { email, firstName, lastName, password, username } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(400, responseMessages.USER.USER_ALREADY_EXISTS);
  }

  // Hash the password
  const hashedPassword = await generatePassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      password: hashedPassword,
      username,
      ...(lastName && { lastName }),
    },
  });

  return {
    email: newUser.email,
    firstName: newUser.firstName,
    id: newUser.id,
    username: newUser.username,
  };
};

const loginUserService = async (req: Request, prisma: PrismaClient) => {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new AppError(404, responseMessages.USER.USER_NOT_FOUND);
  }

  // Verify password
  const isPasswordValid = await comparePassword(
    existingUser.password,
    password
  );

  if (!isPasswordValid) {
    throw new AppError(400, responseMessages.USER.INVALID_CREDENTIALS);
  }

  const token = generateToken(existingUser.username);

  return { token };
};

export const authService = {
  loginUserService,
  registerUserService,
};
