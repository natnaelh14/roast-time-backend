import prisma from '../config/db';
import {
  excludeFromArrayOfObjects,
  excludeFromSingleObject,
} from '../modules/prisma-utils';
import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { IGetUserAuthInfoRequest } from 'src/types';

export async function getRestaurants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { pageCount, name } = req.params;
    const skipCount = (+pageCount - 1) * 10;
    let restaurants;
    let totalCount;

    if (name) {
      restaurants = await prisma.restaurant.findMany({
        skip: skipCount,
        take: 10,
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });

      totalCount = await prisma.restaurant.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      restaurants = await prisma.restaurant.findMany({
        skip: skipCount,
        take: 10,
      });
      totalCount = await prisma.restaurant.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    }
    if (!restaurants.length) {
      return res.status(404).json({ message: 'Unable to find restaurants' });
    }
    const restaurantsWithoutUserId = excludeFromArrayOfObjects(restaurants, [
      'userId',
    ]);
    return res
      .status(200)
      .json({ restaurants: restaurantsWithoutUserId, totalCount });
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
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Unable to find restaurant' });
    }
    const restaurantWithoutUserId = excludeFromSingleObject(restaurant, [
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
    const { name, address, latitude, longitude, category, imageData, userId } =
      req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        category,
        imageData: imageData as Prisma.JsonArray,
        userId,
      },
    });
    if (!newRestaurant) {
      return res.status(404).json({ message: 'unable to create restaurant' });
    }
    return res.status(200).json({ restaurant: newRestaurant });
  } catch (error) {
    return next(error);
  }
}

export async function updateRestaurant(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { restaurantId, accountId } = req.params;
    const { name, address, latitude, longitude, category, imageData } =
      req.body;
    // retrieve user id from token payload
    const id = req?.user?.id;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id_userId: {
          id: restaurantId,
          userId: accountId,
        },
      },
      data: {
        name,
        address,
        latitude,
        longitude,
        category,
        imageData: imageData as Prisma.JsonArray,
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
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { restaurantId, accountId } = req.params;
    // retrieve user id from token payload
    const id = req?.user?.id;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    await prisma.restaurant
      .delete({
        where: {
          id_userId: {
            id: restaurantId,
            userId: accountId,
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
