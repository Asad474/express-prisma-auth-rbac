import jwt from 'jsonwebtoken';

export const generateToken = (username: string): string => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  });

  return token;
};
