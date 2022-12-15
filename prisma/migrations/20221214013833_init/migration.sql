/*
  Warnings:

  - Made the column `imageUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "latitude" DROP DEFAULT,
ALTER COLUMN "longitude" DROP DEFAULT,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "imageUrl" DROP DEFAULT;
