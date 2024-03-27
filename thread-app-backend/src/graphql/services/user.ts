import { prismaClient } from '../../lib/db';
import { createHmac, randomBytes } from 'node:crypto';
interface createUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface GetUserTokenPayload {
  email: string;
  password: string;
}
class UserService {
  public static createUser(payload: createUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString();
    const hashedPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }
  public static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = UserService.getUserByEmail(email);
    if (!user) throw new Error('User not found');
  }
}
export { createUserPayload, UserService };
