import prisma from '../config/db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { NextFunction, Request, Response } from 'express';

export async function handleNewUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    const { password, ...userWithoutPassword } = user;
    const token = createJWT(user);
    res.status(200);
    res.json({ token, account: userWithoutPassword });
  } catch (error) {
    next(error);
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
      return res
        .status(401)
        .json({ message: 'Unable to create an account for the restaurant.' });
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
    const newUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        restaurant: true,
      },
    });
    if (!newUser) {
      return res
        .status(401)
        .json({ message: 'Unable to complete registration' });
    }
    const { password, ...userWithoutPassword } = newUser;
    return res.status(200).json({ token, account: userWithoutPassword });
  } catch (error) {
    return next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    const { id } = req.user;
    if (id !== req.params.accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.accountId,
      },
      include: {
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

export async function handleUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    const { id } = req.user;
    if (id !== req.params.accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
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
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    res.status(200);
    res.json(!user);
  } catch (error) {
    next(error);
  }
}

export async function validatePhoneNumber(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    });
    res.status(200);
    res.json(!user);
  } catch (error) {
    next(error);
  }
}
