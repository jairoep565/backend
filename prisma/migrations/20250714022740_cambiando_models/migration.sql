-- CreateTable
CREATE TABLE "Noticia" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);
