import bcryptjs from "bcryptjs";

export const comparePassword = async (
  dbPassword: string,
  userPassword: string
): Promise<boolean> => {
  return await bcryptjs.compare(userPassword, dbPassword);
};
