/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reviews` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Game` table. All the data in the column will be lost.
  - The `id` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "reviews",
DROP COLUMN "userId",
ADD COLUMN     "discount" DOUBLE PRECISION,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "News";

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
