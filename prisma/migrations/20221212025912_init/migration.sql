/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,userId]` on the table `SavedRestaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedRestaurant_restaurantId_userId_key" ON "SavedRestaurant"("restaurantId", "userId");
