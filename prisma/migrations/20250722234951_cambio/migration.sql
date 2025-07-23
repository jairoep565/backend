/*
  Warnings:

  - You are about to drop the column `estado` on the `Noticia` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Noticia` table. All the data in the column will be lost.
  - Added the required column `image` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Noticia` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Noticia_title_key";

-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "estado",
DROP COLUMN "fecha",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
