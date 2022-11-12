/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_id_userId_key" ON "Restaurant"("id", "userId");
