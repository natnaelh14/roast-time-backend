-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "category" VARCHAR(255),
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3);
