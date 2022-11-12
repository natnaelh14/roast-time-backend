import prisma from '../config/db';
import { Request, Response } from 'express';

export const handleGetAllRestaurants = async (req: Request, res: Response) => {
  const restaurants = await prisma.restaurant.findMany();
  res.status(200);
  res.json({ restaurants });
};

export const handleGetRestaurant = async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.status(200);
  res.json({ restaurant });
};

export const handleRestaurantUpdate = async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.status(200);
  res.json({ restaurant });
};

export const handleNewRestaurant = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.body.userId,
    },
    include: {
      restaurant: true,
    },
  });
  if (user?.accountType === 'GUEST') {
    res.status(404);
    res.json({
      message: 'Guest accounts are not allowed to add a restaurant.',
    });
  }
  if (user?.restaurant) {
    res.status(404);
    res.json({ message: 'User already has a restaurant linked.' });
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
};

export const handleUpdateRestaurant = async (req: Request, res: Response) => {
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
};

export const handleDeleteRestaurant = async (req: Request, res: Response) => {
  await prisma.restaurant.delete({
    where: {
      id_userId: {
        id: req.params.restaurantId,
        userId: req.params.accountId,
      },
    },
  });

  res.json({ message: 'Restaurant has been removed.' });
};
