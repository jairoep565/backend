/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Noticia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Noticia_title_key" ON "Noticia"("title");
