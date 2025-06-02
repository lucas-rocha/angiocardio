/*
  Warnings:

  - A unique constraint covering the columns `[Description]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unit_Description_key" ON "Unit"("Description");
