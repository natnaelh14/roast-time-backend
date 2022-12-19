/*
  Warnings:

  - A unique constraint covering the columns `[id,restaurantId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_restaurantId_key" ON "Reservation"("id", "restaurantId");
