import prisma from '../config/db';
import { NextFunction, Request, Response } from 'express';
import {
  excludeFromArray,
  excludeFromSingleObject,
} from '../modules/prisma-utils';

export async function handleGetAllRestaurants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const restaurants = await prisma.restaurant.findMany();
    const restaurantsWithoutUserId = excludeFromArray(restaurants, ['userId']);
    res.status(200);
    res.json(restaurantsWithoutUserId);
  } catch (error) {
    next(error);
  }
}

export async function handleGetRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: req.params.id,
      },
    });
    const restaurantWithoutUserId = excludeFromSingleObject(restaurant, [
      // @ts-expect-error
      'userId',
    ]);
    res.status(200);
    res.json(restaurantWithoutUserId);
  } catch (error) {
    next(error);
  }
}

export async function handleRestaurantUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200);
    res.json({ restaurant });
  } catch (error) {
    next(error);
  }
}

export async function handleNewRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.userId,
      },
      include: {
        restaurant: true,
      },
    });
    if (user?.accountType === 'GUEST') {
      return res.status(404).json({
        message: 'Guest accounts are not allowed to add a restaurant.',
      });
    }
    if (user?.restaurant) {
      return res
        .status(404)
        .json({ message: 'User already has a restaurant linked.' });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        imageUrl: req.body.imageUrl,
        userId: req.body.userId,
      },
    });
    res.status(200);
    res.json({ restaurant });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id_userId: {
          id: req.params.restaurantId,
          userId: req.params.accountId,
        },
      },
      data: {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
      },
    });
    res.json({ restaurant: updatedRestaurant });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await prisma.restaurant.delete({
      where: {
        id_userId: {
          id: req.params.restaurantId,
          userId: req.params.accountId,
        },
      },
    });

    res.json({ message: 'Restaurant has been removed.' });
  } catch (error) {
    next(error);
  }
}
