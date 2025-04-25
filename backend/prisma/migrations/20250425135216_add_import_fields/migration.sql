-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "nomeConjuge" TEXT,
ADD COLUMN     "profissao" TEXT;

-- AlterTable
ALTER TABLE "contratos" ADD COLUMN     "chave" TEXT,
ADD COLUMN     "dataEmissao" TIMESTAMP(3),
ADD COLUMN     "dataPrimeiraPrestacao" TIMESTAMP(3),
ADD COLUMN     "numeroContrato" TEXT,
ADD COLUMN     "valorPrestacao" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "lotes" ADD COLUMN     "chave" TEXT;

-- CreateIndex
CREATE INDEX "contratos_chave_idx" ON "contratos"("chave");

-- CreateIndex
CREATE INDEX "contratos_numeroContrato_idx" ON "contratos"("numeroContrato");

-- CreateIndex
CREATE INDEX "lotes_chave_idx" ON "lotes"("chave");
