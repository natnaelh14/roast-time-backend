/*
  Warnings:

  - You are about to drop the column `city` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zipCode";
