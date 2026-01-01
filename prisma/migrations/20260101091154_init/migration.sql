-- CreateTable
CREATE TABLE "IndexConfig" (
    "id" TEXT NOT NULL,
    "indexName" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "dropPercentage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexConfig_pkey" PRIMARY KEY ("id")
);
