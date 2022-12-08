/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_userId_key" ON "Reservation"("id", "userId");
