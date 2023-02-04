import prisma from '../config/db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { IGetUserAuthInfoRequest } from 'src/types';

export async function handleNewUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      accountType,
      address,
      latitude,
      longitude,
    } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(req.body.password),
        firstName,
        lastName,
        phoneNumber,
        address,
        latitude,
        longitude,
        accountType: accountType.toUpperCase(),
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unable to create an account.' });
    }
    const { password, ...userWithoutPassword } = user;
    const token = createJWT(user);
    return res.status(200).json({ token, account: userWithoutPassword });
  } catch (error) {
    return next(error);
  }
}

export async function handleSignIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        savedRestaurant: true,
        restaurant: true,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unable to find account with the given email' });
    }
    const isValid = await comparePasswords(req.body.password, user?.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }
    const { password, ...userWithoutPassword } = user;
    const token = createJWT(user);
    return res.status(200).json({ token, account: userWithoutPassword });
  } catch (error) {
    return next(error);
  }
}

export async function handleNewRestaurantUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      accountType,
      name,
      address,
      latitude,
      longitude,
      category,
      imageData,
    } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(req.body.password),
        firstName,
        lastName,
        phoneNumber,
        accountType: accountType.toUpperCase(),
      },
    });
    if (!newUser) {
      return res.status(400).json({
        message: 'unable to create an account for the restaurant user.',
      });
    }
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        category,
        imageData: imageData as Prisma.JsonArray,
        userId: newUser.id,
      },
    });
    if (!newRestaurant) {
      return res.status(400).json({
        message: 'unable to create an account for the restaurant user.',
      });
    }
    const token = createJWT(newUser);
    const user = await prisma.user.findUnique({
      where: {
        id: newUser.id,
      },
      include: {
        restaurant: true,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: 'unable to create an account for the restaurant user.',
      });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ token, account: userWithoutPassword });
  } catch (error) {
    return next(error);
  }
}

export async function getUser(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { accountId } = req.params;
    // retrieve user id from token payload
    const id = req?.user?.id;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: accountId,
      },
      include: {
        savedRestaurant: true,
        restaurant: true,
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unable to find user' });
    }
    const { password, ...userData } = user;
    return res.status(200).json({ account: userData });
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const { accountId } = req.params;
    // retrieve user id from token payload
    const id = req?.user?.id;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: accountId,
      },
      data: {
        firstName,
        lastName,
        phoneNumber,
      },
    });
    return res.status(200).json({ restaurant: updatedUser });
  } catch (error) {
    return next(error);
  }
}

export async function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return res.status(200).json({ isValid: !user });
  } catch (error) {
    return next(error);
  }
}

export async function validatePhoneNumber(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { phoneNumber } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
    return res.status(200).json({ isValid: !user });
  } catch (error) {
    return next(error);
  }
}
