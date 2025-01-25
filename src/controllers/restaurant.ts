import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "~/types";
import prisma from "~/config/db";
import { excludeFromArrayOfObjects, excludeFromSingleObject } from "~/modules/prisma-utils";

interface IRestaurant {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	category: string;
	imageData: Prisma.JsonArray;
	userId: string;
}

export async function getRestaurants(req: Request, res: Response, next: NextFunction) {
	try {
		const { pageCount, name } = req.params;
		const skipCount = ((pageCount ? +pageCount : 1) - 1) * 8;
		let restaurants;
		let totalCount;

		if (name) {
			restaurants = await prisma.restaurant.findMany({
				skip: skipCount,
				take: 8,
				where: {
					name: {
						contains: name,
						mode: "insensitive",
					},
				},
				orderBy: [
					{
						name: "asc",
					},
				],
			});

			totalCount = await prisma.restaurant.count({
				where: {
					name: {
						contains: name,
						mode: "insensitive",
					},
				},
			});
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			restaurants = await prisma.restaurant.findMany({
				skip: skipCount,
				take: 8,
				orderBy: [
					{
						name: "asc",
					},
				],
			});
			totalCount = await prisma.restaurant.count({
				where: {
					name: {
						contains: name,
						mode: "insensitive",
					},
				},
			});
		}
		if (!restaurants.length) {
			return res.status(404).json({ message: "Unable to find restaurants" });
		}
		const restaurantsWithoutUserId = excludeFromArrayOfObjects(restaurants, ["userId"]);
		return res.status(200).json({ restaurants: restaurantsWithoutUserId, totalCount });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getRestaurantById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id,
			},
		});
		if (!restaurant) {
			return res.status(404).json({ message: "Unable to find restaurant" });
		}
		const restaurantWithoutUserId = excludeFromSingleObject(restaurant, ["userId"]);
		return res.status(200).json(restaurantWithoutUserId);
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function handleNewRestaurant(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, address, latitude, longitude, category, imageData, userId } = req.body as IRestaurant;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				restaurant: true,
			},
		});
		if (user?.accountType === "GUEST") {
			return res.status(404).json({
				message: "Guest accounts are not allowed to add a restaurant.",
			});
		}
		if (user?.restaurant) {
			return res.status(404).json({ message: "User already has a restaurant linked." });
		}

		const newRestaurant = await prisma.restaurant.create({
			data: {
				name,
				address,
				latitude,
				longitude,
				category,
				imageData,
				userId,
			},
		});
		if (!newRestaurant) {
			return res.status(404).json({ message: "unable to create restaurant" });
		}
		return res.status(200).json({ restaurant: newRestaurant });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function updateRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { restaurantId, accountId } = req.params;
		const { name, address, latitude, longitude, category, imageData } = req.body as IRestaurant;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const updatedRestaurant = await prisma.restaurant.update({
			where: {
				id_userId: {
					id: restaurantId || "",
					userId: accountId || "",
				},
			},
			data: {
				name,
				address,
				latitude,
				longitude,
				category,
				imageData,
			},
		});
		if (!updatedRestaurant) {
			return res.status(404).json({ message: "Unable to update restaurant" });
		}
		return res.json({ restaurant: updatedRestaurant });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function deleteRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { restaurantId, accountId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		await prisma.restaurant
			.delete({
				where: {
					id_userId: {
						id: restaurantId || "",
						userId: accountId || "",
					},
				},
			})
			.catch(() => {
				return res.status(404).json({ message: "Unable to update restaurant" });
			});

		return res.json({ message: "Restaurant has been removed." });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function handleSaveRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { accountId, restaurantId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const savedRestaurant = await prisma.savedRestaurant.create({
			data: {
				userId: accountId || "",
				restaurantId: restaurantId || "",
			},
		});

		if (!savedRestaurant) {
			return res.status(404).json({ message: "unable to save restaurant" });
		}
		return res.status(200).json({ savedRestaurant });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function handleRemoveSavedRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { accountId, restaurantId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const deletedRestaurant = await prisma.savedRestaurant.delete({
			where: {
				restaurantId_userId: {
					userId: accountId || "",
					restaurantId: restaurantId || "",
				},
			},
		});

		if (!deletedRestaurant) {
			return res.status(404).json({ deletedRestaurant });
		}
		return res.status(200).json({ deletedRestaurant });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getSavedRestaurant(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { accountId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const savedRestaurants = await prisma.savedRestaurant.findMany({
			where: {
				userId: accountId,
			},
			include: {
				restaurant: true,
			},
		});

		if (!savedRestaurants) {
			return res.status(404).json({ message: "unable to save restaurant" });
		}
		return res.status(200).json({ savedRestaurants });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}
