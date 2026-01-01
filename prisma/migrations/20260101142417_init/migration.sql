/*
  Warnings:

  - You are about to drop the `IndexConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "IndexConfig";

-- CreateTable
CREATE TABLE "index_config" (
    "id" TEXT NOT NULL,
    "indexName" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "dropPercentage" DOUBLE PRECISION NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "index_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_logs" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "dropPercent" DOUBLE PRECISION NOT NULL,
    "priceAtAlert" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "index_config_symbol_key" ON "index_config"("symbol");

-- CreateIndex
CREATE INDEX "price_history_symbol_createdAt_idx" ON "price_history"("symbol", "createdAt");

-- CreateIndex
CREATE INDEX "alert_logs_symbol_createdAt_idx" ON "alert_logs"("symbol", "createdAt");
