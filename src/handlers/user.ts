import prisma from '../config/db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { Request, Response } from 'express';

export const createNewUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: await hashPassword(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      accountType: req.body.accountType.toUpperCase(),
    },
  });
  const token = createJWT(user);
  res.status(200);
  res.json({ token });
};

export const signIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(401);
    res.json({ message: 'Unable to find account with the given email' });
    return;
  }
  const isValid = await comparePasswords(req.body.password, user?.password);
  if (!isValid) {
    res.status(401);
    res.json({ message: 'Password is incorrect' });
    return;
  }
  const token = createJWT(user);
  res.status(200);
  res.json({ token });
};

export const validateEmail = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  res.status(200);
  res.json(user ? false : true);
};

export const validatePhoneNumber = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  });
  res.status(200);
  res.json(user ? false : true);
};
