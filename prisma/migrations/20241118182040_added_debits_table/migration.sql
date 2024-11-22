-- CreateTable
CREATE TABLE "Debits" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valueToPay" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Debits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debits" ADD CONSTRAINT "Debits_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
