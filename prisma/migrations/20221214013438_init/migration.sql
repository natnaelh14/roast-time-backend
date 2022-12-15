-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT DEFAULT 'https://res.cloudinary.com/doalzf6o2/image/upload/v1669413457/cn5520zlzdmtk8wgf43k.jpg',
ALTER COLUMN "latitude" SET DEFAULT 39.0210587,
ALTER COLUMN "longitude" SET DEFAULT -77.01184649999999;
