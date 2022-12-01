/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Restaurant` table. All the data in the column will be lost.
  - Made the column `imageData` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "imageUrl",
ALTER COLUMN "imageData" SET NOT NULL;
