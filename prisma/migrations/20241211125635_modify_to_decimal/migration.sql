/*
  Warnings:

  - Changed the type of `valueToPay` on the `Credits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `valueToPay` on the `Debits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Credits" DROP COLUMN "valueToPay",
ADD COLUMN     "valueToPay" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Debits" DROP COLUMN "valueToPay",
ADD COLUMN     "valueToPay" DECIMAL(10,2) NOT NULL;
