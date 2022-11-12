import prisma from '../config/db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { Request, Response } from 'express';

export const handleNewUser = async (req: Request, res: Response) => {
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

export const handleSignIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    include: {
      restaurant: true,
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
  const { password, ...userInfo } = user;
  const token = createJWT(user);
  res.status(200);
  res.json({ token, account: { ...userInfo } });
};

export const handleNewRestaurantUser = async (req: Request, res: Response) => {
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
  if (!user) {
    res.status(401);
    res.json({ message: 'Unable to create an account for the restaurant.' });
    return;
  }
  await prisma.restaurant.create({
    data: {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      imageUrl: req.body.imageUrl,
      userId: user.id,
    },
  });
  const token = createJWT(user);
  let newUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      restaurant: true,
    },
  });
  res.status(200);
  res.json({ token, account: { ...newUser } });
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
