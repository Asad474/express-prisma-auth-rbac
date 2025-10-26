import { authMessages } from './auth.message';
import { AuthRepository } from './auth.repository';
import { ILogin, IRegister } from './auth.types';
import { PrismaClient } from '../../../../../generated/prisma';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { AppError } from '../../../../utils/AppError';
import { generateToken } from '../../../../utils/generateToken';
import {
  comparePassword,
  generatePassword,
} from '../../../../utils/passwordUtility';

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Registers a new user with the given data.
   *
   * @throws {AppError} If a user with the given email already exists.
   *
   * @param {IRegister} data - The data for the new user.
   * @param {PrismaClient} prisma - The Prisma client.
   *
   * @returns {Promise<{email: string, firstName: string, id: string, username: string}>}
   * A promise that resolves with the newly created user.
   */
  async registerUserService(
    data: IRegister,
    prisma: PrismaClient,
  ): Promise<{
    email: string;
    firstName: string;
    id: string;
    username: string;
  }> {
    const { email, firstName, lastName, password, username } = data;

    const existingUser = await this.authRepository.getUser(email, prisma);

    if (existingUser) {
      throw new AppError(
        httpStatusCode.CONFLICT,
        authMessages.USER_ALREADY_EXISTS,
      );
    }

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
  }

  /**
   * Logs in a user with the given email and password.
   *
   * @throws {AppError} If the user with the given email does not exist.
   * @throws {AppError} If the given password is invalid.
   *
   * @param {ILogin} data - The data for the user to log in.
   * @param {PrismaClient} prisma - The Prisma client.
   *
   * @returns {Promise<{token: string}>} A promise that resolves with a token for the logged in user.
   */
  async loginUserService(
    data: ILogin,
    prisma: PrismaClient,
  ): Promise<{ token: string }> {
    const { email, password } = data;

    const existingUser = await this.authRepository.getUser(email, prisma);
    if (!existingUser) {
      throw new AppError(httpStatusCode.NOT_FOUND, authMessages.USER_NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(
      existingUser.password,
      password,
    );

    if (!isPasswordValid) {
      throw new AppError(400, authMessages.INVALID_CREDENTIALS);
    }

    const token = generateToken(existingUser.username);

    return { token };
  }
}
