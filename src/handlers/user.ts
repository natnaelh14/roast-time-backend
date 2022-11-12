import prisma from '../config/db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { NextFunction, Request, Response } from 'express';

export const handleNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const handleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const handleNewRestaurantUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.accountId,
      },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
      },
    });
    res.json({ restaurant: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.status(204);
};

export const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    res.status(200);
    res.json(user ? false : true);
  } catch (error) {
    next(error);
  }
};

export const validatePhoneNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    });
    res.status(200);
    res.json(user ? false : true);
  } catch (error) {
    next(error);
  }
};
