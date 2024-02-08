import { Prisma, ACCOUNT_TYPE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "src/types";
import prisma from "../config/db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

interface IUser {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	accountType: ACCOUNT_TYPE;
	address: string;
	latitude: number;
	longitude: number;
}
interface IUpdateUser {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
}
interface IRestaurantUser extends IUser {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	category: string;
	imageData: Prisma.JsonArray;
}

export async function handleNewUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, password, firstName, lastName, phoneNumber, accountType, address, latitude, longitude } =
			req.body as IUser;
		const user = await prisma.user.create({
			data: {
				email,
				password: await hashPassword(password),
				firstName,
				lastName,
				phoneNumber,
				address,
				latitude,
				longitude,
				accountType,
			},
		});
		if (!user) {
			return res.status(401).json({ message: "Unable to create an account." });
		}
		const { password: userPassword, ...userWithoutPassword } = user;
		const token = createJWT(user);
		return res.status(200).json({ token, account: userWithoutPassword });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function handleSignIn(req: Request, res: Response, next: NextFunction) {
	const { email, password } = req.body as { email: string; password: string };
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				savedRestaurant: true,
				restaurant: true,
			},
		});
		if (!user) {
			return res.status(401).json({ message: "Unable to find account with the given email" });
		}
		const isValid = await comparePasswords(password, user?.password);
		if (!isValid) {
			return res.status(401).json({ message: "Password is incorrect" });
		}
		const { password: userPassword, ...userWithoutPassword } = user;
		const token = createJWT(user);
		return res.status(200).json({ token, account: userWithoutPassword });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function handleNewRestaurantUser(req: Request, res: Response, next: NextFunction) {
	try {
		const {
			email,
			password,
			firstName,
			lastName,
			phoneNumber,
			accountType,
			name,
			address,
			latitude,
			longitude,
			category,
			imageData,
		} = req.body as IRestaurantUser;
		const newUser = await prisma.user.create({
			data: {
				email,
				password: await hashPassword(password),
				firstName,
				lastName,
				phoneNumber,
				accountType,
			},
		});
		if (!newUser) {
			return res.status(400).json({
				message: "unable to create an account for the restaurant user.",
			});
		}
		const newRestaurant = await prisma.restaurant.create({
			data: {
				name,
				address,
				latitude,
				longitude,
				category,
				imageData,
				userId: newUser.id,
			},
		});
		if (!newRestaurant) {
			return res.status(400).json({
				message: "unable to create an account for the restaurant user.",
			});
		}
		const token = createJWT(newUser);
		const user = await prisma.user.findUnique({
			where: {
				id: newUser.id,
			},
			include: {
				restaurant: true,
			},
		});
		if (!user) {
			return res.status(400).json({
				message: "unable to create an account for the restaurant user.",
			});
		}
		const { password: userPassword, ...userWithoutPassword } = user;
		return res.status(200).json({ token, account: userWithoutPassword });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function getUser(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { accountId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const user = await prisma.user.findUnique({
			where: {
				id: accountId,
			},
			include: {
				savedRestaurant: true,
				restaurant: true,
			},
		});
		if (!user) {
			return res.status(401).json({ message: "Unable to find user" });
		}
		const { password, ...userData } = user;
		return res.status(200).json({ account: userData });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function updateUser(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
	try {
		const { firstName, lastName, phoneNumber } = req.body as IUpdateUser;
		const { accountId } = req.params;
		// retrieve user id from token payload
		const id = req?.user?.id;
		if (id !== accountId) {
			return res.status(403).json({ message: "user doesn't have access rights" });
		}
		const updatedUser = await prisma.user.update({
			where: {
				id: accountId,
			},
			data: {
				firstName,
				lastName,
				phoneNumber,
			},
		});
		return res.status(200).json({ account: updatedUser });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function validateEmail(req: Request, res: Response, next: NextFunction) {
	try {
		const { email } = req.params;
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		return res.status(200).json({ isValid: !user });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}

export async function validatePhoneNumber(req: Request, res: Response, next: NextFunction) {
	try {
		const { phoneNumber } = req.params;
		const user = await prisma.user.findUnique({
			where: {
				phoneNumber,
			},
		});
		return res.status(200).json({ isValid: !user });
	} catch (e) {
		if (e instanceof Error) {
			next(e);
		}
	}
	return null;
}
