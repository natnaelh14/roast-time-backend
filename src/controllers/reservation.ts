import prisma from '../config/db';
import { NextFunction, Request, Response } from 'express';

export async function handleNewReservation(
  req: Request,
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
    // @ts-ignore:next-line
    const { id } = req.user;
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { accountId } = req.params;
    // @ts-ignore:next-line
    const { id } = req.user;
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
      return res.status(401).json({ message: 'There are no reservations.' });
    }
    return res.status(200).json({ reservations });
  } catch (error) {
    return next(error);
  }
}

export async function updateReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { accountId, reservationId } = req.params;
    const { partySize, reservationDate, reservationTime } = req.body;
    // @ts-ignore:next-line
    const { id } = req.user;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        partySize,
        reservationDate: reservationDate && new Date(reservationDate),
        reservationTime,
      },
    });
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Unable to update reservation' });
    }
    return res.json({ restaurant: updatedReservation });
  } catch (error) {
    return next(error);
  }
}

export async function deleteReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { accountId, reservationId } = req.params;
    // @ts-ignore:next-line
    const { id } = req.user;
    if (id !== accountId) {
      return res
        .status(403)
        .json({ message: "user doesn't have access rights" });
    }
    await prisma.reservation
      .delete({
        where: {
          id: reservationId,
        },
      })
      .catch(() => {
        return res.status(404).json({ message: 'Unable to update restaurant' });
      });

    return res.json({ message: 'Reservation has successfully been removed.' });
  } catch (error) {
    return next(error);
  }
}
