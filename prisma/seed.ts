/* eslint-disable prettier/prettier */
import { PrismaClient } from "@prisma/client";
import { restaurants } from "./restaurants";
import { user } from "./user";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.upsert({
		where: { id: user.id },
		update: {},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		create: user,
	});

	for (const restaurant of restaurants) {
		await prisma.restaurant.upsert({
			where: { name: restaurant.name },
			update: {},
			create: restaurant,
		});
	}
}

void main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	.finally(async () => {
		await prisma.$disconnect();
	});
