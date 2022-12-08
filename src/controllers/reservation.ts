import prisma from '../config/db';
import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from 'src/types';

export async function handleNewReservation(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      partySize,
      reservationDate,
      reservationTime,
      userId,
      restaurantId,
    } = req.body;
    // retrieve user id from token payload
    const id = req?.user?.id;
    if (id !== userId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const reservation = await prisma.reservation.create({
      data: {
        partySize,
        reservationDate: new Date(reservationDate),
        reservationTime,
        userId,
        restaurantId,
      },
    });
    if (!reservation) {
      return res
        .status(401)
        .json({ message: 'Unable to create an account for the restaurant.' });
    }
    return res.status(200).json({ reservation });
  } catch (error) {
    return next(error);
  }
}

export async function getReservations(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // retrieve user id from token payload
    const id = req?.user?.id;
    const { accountId } = req.params;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: accountId,
      },
      include: {
        restaurant: true,
      },
    });
    if (!reservations) {
      return res.status(404).json({ message: 'There are no reservations.' });
    }
    return res.status(200).json({ reservations });
  } catch (error) {
    return next(error);
  }
}

export async function updateReservation(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // retrieve user id from token payload
    const id = req?.user?.id;
    const { accountId, reservationId } = req.params;
    const { partySize, reservationDate, reservationTime } = req.body;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id_userId: {
          id: reservationId,
          userId: accountId,
        },
      },
      data: {
        partySize,
        reservationDate: reservationDate && new Date(reservationDate),
        reservationTime,
      },
    });

    if (!updatedReservation) {
      return res.status(404).json({ message: 'unable to update reservation' });
    }
    return res.json({ restaurant: updatedReservation });
  } catch (error) {
    return next(error);
  }
}

export async function deleteReservation(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // retrieve user id from token payload
    const id = req?.user?.id;
    const { accountId, reservationId } = req.params;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }

    await prisma.reservation
      .delete({
        where: {
          id_userId: {
            id: reservationId,
            userId: accountId,
          },
        },
      })
      .catch(() => {
        return res.status(404).json({ message: 'unable to update restaurant' });
      });

    return res.json({ message: 'reservation has successfully been removed.' });
  } catch (error) {
    return next(error);
  }
}
