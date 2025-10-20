import bcryptjs from 'bcryptjs';

export const generatePassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
};

export const comparePassword = async (
  dbPassword: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcryptjs.compare(userPassword, dbPassword);
};
