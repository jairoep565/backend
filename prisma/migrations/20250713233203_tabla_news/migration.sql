/*
  Warnings:

  - You are about to drop the column `userId` on the `News` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_userId_fkey";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "userId";
