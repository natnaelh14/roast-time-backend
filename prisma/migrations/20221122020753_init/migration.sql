/*
  Warnings:

  - Made the column `imageUrl` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL;
