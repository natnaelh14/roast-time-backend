import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from 'src/types';
import bcrypt from 'bcrypt';

interface UserProps {
  id: string;
  email: string;
  accountType: 'GUEST' | 'RESTAURANT';
}
export const createJWT = (user: UserProps) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '30m',
    }
  );
};

export const protectRoute = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'Not Authorized' });
  }

  const [, token] = bearer?.split(' ') ?? [undefined];
  if (!token) {
    res.status(401);
    res.json({ message: 'not valid token' });
  }

  try {
    const user = jwt.verify(token!, process.env.JWT_SECRET!);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: 'not valid token' });
    return;
  }
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
