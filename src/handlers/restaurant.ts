import prisma from '../config/db';
import { Request, Response } from 'express';

export const getAllRestaurants = async (req: Request, res: Response) => {
  const restaurants = await prisma.restaurant.findMany();
  res.status(200);
  res.json({ restaurants });
};

export const getRestaurant = async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.status(200);
  res.json({ restaurant });
};
