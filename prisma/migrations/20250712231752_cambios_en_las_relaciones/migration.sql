/*
  Warnings:

  - You are about to drop the column `plataformaId` on the `Juego` table. All the data in the column will be lost.
  - Added the required column `estaOferta` to the `Juego` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Juego" DROP CONSTRAINT "Juego_plataformaId_fkey";

-- AlterTable
ALTER TABLE "Juego" DROP COLUMN "plataformaId",
ADD COLUMN     "estaOferta" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "_JuegoPlataformas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JuegoPlataformas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JuegoPlataformas_B_index" ON "_JuegoPlataformas"("B");

-- AddForeignKey
ALTER TABLE "_JuegoPlataformas" ADD CONSTRAINT "_JuegoPlataformas_A_fkey" FOREIGN KEY ("A") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JuegoPlataformas" ADD CONSTRAINT "_JuegoPlataformas_B_fkey" FOREIGN KEY ("B") REFERENCES "Plataforma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
