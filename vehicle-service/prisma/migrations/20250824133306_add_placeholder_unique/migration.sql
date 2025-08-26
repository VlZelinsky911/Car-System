/*
  Warnings:

  - A unique constraint covering the columns `[userId,placeholder]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "placeholder" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_userId_placeholder_key" ON "Vehicle"("userId", "placeholder");
