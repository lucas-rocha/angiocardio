/*
  Warnings:

  - Added the required column `issueDate` to the `Debits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debits" ADD COLUMN     "issueDate" TIMESTAMP(3) NOT NULL;
