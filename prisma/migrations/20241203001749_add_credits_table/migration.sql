-- CreateTable
CREATE TABLE "Credits" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valueToPay" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "IsBaixa" BOOLEAN NOT NULL DEFAULT false,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Credits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
