import prisma from '../config/db';
import {
  excludeFromArrayOfObjects,
  excludeFromSingleObject,
} from '../modules/prisma-utils';
import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export async function getRestaurants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let restaurants;
    if (req.params.name) {
      restaurants = await prisma.restaurant.findMany({
        where: {
          name: {
            contains: req.params.name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      restaurants = await prisma.restaurant.findMany();
    }
    if (!restaurants.length) {
      return res.status(401).json({ message: 'Unable to find restaurants' });
    }
    const restaurantsWithoutUserId = excludeFromArrayOfObjects(restaurants, [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      'userId',
    ]);
    return res.status(200).json(restaurantsWithoutUserId);
  } catch (error) {
    return next(error);
  }
}

export async function getRestaurantById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!restaurant) {
      return res.status(401).json({ message: 'Unable to find restaurant' });
    }
    const restaurantWithoutUserId = excludeFromSingleObject(restaurant, [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      'userId',
    ]);
    return res.status(200).json(restaurantWithoutUserId);
  } catch (error) {
    return next(error);
  }
}

export async function handleNewRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        category: req.body.category,
        imageData: req.body.imageData as Prisma.JsonArray,
        userId: req.body.userId,
      },
    });
    return res.status(200).json({ restaurant });
  } catch (error) {
    return next(error);
  }
}

export async function updateRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        category: req.body.category,
        imageData: req.body.imageData as Prisma.JsonArray,
      },
    });
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Unable to update restaurant' });
    }
    return res.json({ restaurant: updatedRestaurant });
  } catch (error) {
    return next(error);
  }
}

export async function deleteRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await prisma.restaurant
      .delete({
        where: {
          id_userId: {
            id: req.params.restaurantId,
            userId: req.params.accountId,
          },
        },
      })
      .catch(() => {
        return res.status(404).json({ message: 'Unable to update restaurant' });
      });

    return res.json({ message: 'Restaurant has been removed.' });
  } catch (error) {
    return next(error);
  }
}
