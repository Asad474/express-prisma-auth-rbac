import { Request, Response } from "express";

import { PrismaClient } from "../../generated/prisma";
import { responseMessages } from "../common/constants/message";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = (prisma: PrismaClient) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const newUser = await authService.registerUserService(req, prisma);

    return res.status(201).json({
      data: newUser,
      message: responseMessages.USER.USER_REGISTERED,
      success: true,
    });
  });
};

const loginUser = (prisma: PrismaClient) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.loginUserService(req, prisma);
    const { token } = response;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .send({
        message: responseMessages.USER.USER_LOGGED_IN,
        success: true,
      });
  });
};

const logoutUser = (req: Request, res: Response) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    })
    .send({
      message: responseMessages.USER.USER_LOGGED_OUT,
      success: true,
    });
};

export const authController = {
  loginUser,
  logoutUser,
  registerUser,
};
