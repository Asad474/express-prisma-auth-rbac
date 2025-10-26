import { PrismaClient, User } from '../../../../../generated/prisma';

export class AuthRepository {
  async getUser(email: string, prisma: PrismaClient): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(
    data: {
      email: string;
      firstName: string;
      lastName?: string;
      password: string;
      username: string;
    },
    prisma: PrismaClient,
  ): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }
}
