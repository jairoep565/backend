/*
  Warnings:

  - You are about to drop the `Calificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Juego` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Noticia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plataforma` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JuegoPlataformas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Juego" DROP CONSTRAINT "Juego_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_JuegoPlataformas" DROP CONSTRAINT "_JuegoPlataformas_A_fkey";

-- DropForeignKey
ALTER TABLE "_JuegoPlataformas" DROP CONSTRAINT "_JuegoPlataformas_B_fkey";

-- DropTable
DROP TABLE "Calificacion";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "Juego";

-- DropTable
DROP TABLE "Noticia";

-- DropTable
DROP TABLE "Plataforma";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "Venta";

-- DropTable
DROP TABLE "_JuegoPlataformas";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "onSale" BOOLEAN NOT NULL,
    "images" TEXT[],
    "rating" DOUBLE PRECISION,
    "reviews" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
