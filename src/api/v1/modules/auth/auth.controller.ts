import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { authMessages } from './auth.message';
import { AuthService } from './auth.service';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { sendResponse } from '../../../../utils/sendResponse';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaClient,
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const newUser = await this.authService.registerUserService(
      req.body,
      this.prisma,
    );

    sendResponse(res, {
      data: newUser,
      message: authMessages.USER_REGISTERED,
      statusCode: httpStatusCode.CREATED,
      success: true,
    });
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const response = await this.authService.loginUserService(
      req.body,
      this.prisma,
    );
    const { token } = response;

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === 'production',
    });

    sendResponse(res, {
      message: authMessages.USER_LOGGED_IN,
      statusCode: httpStatusCode.OK,
      success: true,
    });
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    sendResponse(res, {
      message: authMessages.USER_LOGGED_OUT,
      statusCode: httpStatusCode.OK,
      success: true,
    });
  }
}
