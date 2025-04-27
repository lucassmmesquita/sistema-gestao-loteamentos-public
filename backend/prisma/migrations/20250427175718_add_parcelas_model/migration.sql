/*
  Warnings:

  - A unique constraint covering the columns `[parcelaId]` on the table `boletos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "parcelaId" INTEGER;

-- CreateTable
CREATE TABLE "parcelas" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'futura',
    "dataPagamento" TIMESTAMP(3),
    "valorPago" DECIMAL(10,2),
    "formaPagamento" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boletoId" INTEGER,

    CONSTRAINT "parcelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parcelas_boletoId_key" ON "parcelas"("boletoId");

-- CreateIndex
CREATE INDEX "parcelas_contratoId_idx" ON "parcelas"("contratoId");

-- CreateIndex
CREATE INDEX "parcelas_status_idx" ON "parcelas"("status");

-- CreateIndex
CREATE INDEX "parcelas_dataVencimento_idx" ON "parcelas"("dataVencimento");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_parcelaId_key" ON "boletos"("parcelaId");

-- AddForeignKey
ALTER TABLE "parcelas" ADD CONSTRAINT "parcelas_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas" ADD CONSTRAINT "parcelas_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
