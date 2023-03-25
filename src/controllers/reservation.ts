import { NextFunction, Response } from "express";
import { IGetUserAuthInfoRequest } from "src/types";
import prisma from "../config/db";

interface IUpdateReservation {
	partySize: number;
	reservationDate: Date;
	reservationTime: string;
}
interface IReservation {
	partySize: number;
	reservationDate: Date;
	reservationTime: string;
	userId: string;
	restaurantId: string;
}

export async function handleNewReservation(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { partySize, reservationDate, reservationTime, userId, restaurantId } = req.body as IReservation;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== userId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
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
			return res.status(401).json({ message: "Unable to create an account for the restaurant." });
		}
		return res.status(200).json({ reservation });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getReservations(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		// retrieve user id from token payload
		const id = req?.user?.id;
		const { accountId } = req.params;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const reservations = await prisma.reservation.findMany({
			where: {
				userId: accountId,
				reservationDate: {
					gte: new Date(),
				},
			},
			orderBy: [
				{
					reservationDate: "asc",
				},
			],
			include: {
				restaurant: true,
			},
		});
		if (!reservations) {
			return res.status(404).json({ message: "There are no reservations." });
		}
		return res.status(200).json({ reservations });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getReservationsHistory(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		// retrieve user id from token payload
		const id = req?.user?.id;
		const { accountId } = req.params;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const reservations = await prisma.reservation.findMany({
			where: {
				userId: accountId,
				reservationDate: {
					lt: new Date(),
				},
			},
			orderBy: [
				{
					reservationDate: "asc",
				},
			],
			include: {
				restaurant: true,
			},
		});
		if (!reservations) {
			return res.status(404).json({ message: "There are no reservations." });
		}
		return res.status(200).json({ reservations });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function updateReservation(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		// retrieve user id from token payload
		const id = req?.user?.id;
		const { accountId, reservationId } = req.params;
		const { partySize, reservationDate, reservationTime } = req.body as IUpdateReservation;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}

		const updatedReservation = await prisma.reservation.update({
			where: {
				id_userId: {
					id: reservationId || "",
					userId: accountId || "",
				},
			},
			data: {
				partySize,
				reservationDate: reservationDate && new Date(reservationDate),
				reservationTime,
			},
		});

		if (!updatedReservation) {
			return res.status(404).json({ message: "unable to update reservation" });
		}
		return res.json({ restaurant: updatedReservation });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function deleteReservation(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		// retrieve user id from token payload
		const id = req?.user?.id;
		const { accountId, reservationId } = req.params;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}

		await prisma.reservation
			.delete({
				where: {
					id_userId: {
						id: reservationId || "",
						userId: accountId || "",
					},
				},
			})
			.catch(() => {
				return res.status(404).json({ message: "unable to update restaurant" });
			});

		return res.json({ message: "reservation has successfully been removed." });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getReservationForRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { accountId, restaurantId, reservationDate } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		if (req?.user?.accountType !== "RESTAURANT") {
			return res.status(404).json({
				message: "Guest accounts are not allowed to view restaurant reservations.",
			});
		}
		const restaurantReservations = await prisma.reservation.findMany({
			where: {
				restaurantId,
				...(reservationDate?.length ? { reservationDate: new Date(reservationDate) } : {}),
			},
			include: {
				user: true,
			},
		});
		if (!restaurantReservations) {
			return res.status(401).json({ message: "Unable to find reservations for this restaurant." });
		}
		return res.status(200).json({ reservations: restaurantReservations });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function updateReservationForRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { restaurantId, reservationId } = req.params;
		const { partySize, reservationDate, reservationTime } = req.body as IUpdateReservation;

		const updatedReservation = await prisma.reservation.update({
			where: {
				id_restaurantId: {
					id: reservationId || "",
					restaurantId: restaurantId || "",
				},
			},
			data: {
				partySize,
				reservationDate: reservationDate && new Date(reservationDate),
				reservationTime,
			},
		});

		if (!updatedReservation) {
			return res.status(404).json({ message: "unable to update reservation" });
		}
		return res.json({ restaurant: updatedReservation });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function deleteReservationForRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { restaurantId, reservationId } = req.params;

		await prisma.reservation
			.delete({
				where: {
					id_restaurantId: {
						id: reservationId || "",
						restaurantId: restaurantId || "",
					},
				},
			})
			.catch(() => {
				return res.status(404).json({ message: "unable to delete restaurant" });
			});

		return res.json({ message: "reservation has successfully been removed." });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}
