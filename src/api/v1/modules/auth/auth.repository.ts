import { PrismaClient, User } from '../../../../../generated/prisma';

export class AuthRepository {
  async getUser(email: string, prisma: PrismaClient): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
