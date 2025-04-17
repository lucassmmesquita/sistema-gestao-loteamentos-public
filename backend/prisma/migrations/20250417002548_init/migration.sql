-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "telefones" TEXT[],
    "emails" TEXT[],

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "loteamento" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "valorBase" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "valorEntrada" DECIMAL(10,2) NOT NULL,
    "numeroParcelas" INTEGER NOT NULL,
    "dataVencimento" INTEGER NOT NULL,
    "clausulas" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parcelasPagas" INTEGER NOT NULL DEFAULT 0,
    "ultimoReajuste" JSONB,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "numeroParcela" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "nossoNumero" TEXT NOT NULL,
    "linhaDigitavel" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'gerado',
    "dataPagamento" TIMESTAMP(3),
    "valorPago" DECIMAL(10,2),
    "formaPagamento" TEXT,
    "dataCancelamento" TIMESTAMP(3),
    "comprovante" TEXT,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reajustes" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "parcelaReferencia" INTEGER NOT NULL,
    "valorOriginal" DECIMAL(10,2) NOT NULL,
    "valorReajustado" DECIMAL(10,2) NOT NULL,
    "indiceAplicado" DECIMAL(6,2) NOT NULL,
    "indiceBase" TEXT NOT NULL,
    "percentualAdicional" DECIMAL(6,2) NOT NULL,
    "reajusteTotal" DECIMAL(6,2) NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "dataAplicacao" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "aplicado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametros_reajuste" (
    "id" SERIAL NOT NULL,
    "indiceBase" TEXT NOT NULL,
    "percentualAdicional" DECIMAL(6,2) NOT NULL,
    "intervaloParcelas" INTEGER NOT NULL,
    "alertaAntecipadoDias" INTEGER NOT NULL,

    CONSTRAINT "parametros_reajuste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indices_economicos" (
    "id" SERIAL NOT NULL,
    "IGPM" DECIMAL(6,2) NOT NULL,
    "IPCA" DECIMAL(6,2) NOT NULL,
    "INPC" DECIMAL(6,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indices_economicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes_inadimplentes" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "valorEmAberto" DECIMAL(10,2) NOT NULL,
    "diasAtraso" INTEGER NOT NULL,
    "ultimaCobranca" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "clientes_inadimplentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas_inadimplentes" (
    "id" SERIAL NOT NULL,
    "clienteInadimplente_id" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "valorAtualizado" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "parcelas_inadimplentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacoes" (
    "id" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "parcelaId" TEXT,

    CONSTRAINT "interacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunicacoes" (
    "id" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parcelaInfo" JSONB,
    "anexos" JSONB,

    CONSTRAINT "comunicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos_mensagem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,

    CONSTRAINT "modelos_mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracao_gatilhos" (
    "id" SERIAL NOT NULL,
    "executarAutomaticamente" BOOLEAN NOT NULL DEFAULT true,
    "horarioExecucao" TEXT NOT NULL,
    "diasExecucao" TEXT[],
    "repetirCobrancas" BOOLEAN NOT NULL DEFAULT true,
    "intervaloRepeticao" INTEGER NOT NULL DEFAULT 7,
    "limitarRepeticoes" BOOLEAN NOT NULL DEFAULT true,
    "limiteRepeticoes" INTEGER NOT NULL DEFAULT 3,
    "gerarLog" BOOLEAN NOT NULL DEFAULT true,
    "gatilhos" JSONB NOT NULL,

    CONSTRAINT "configuracao_gatilhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aditivos" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataAssinatura" TIMESTAMP(3) NOT NULL,
    "motivoAditivo" TEXT NOT NULL,
    "novoValor" DECIMAL(10,2),
    "novaDataFim" TIMESTAMP(3),
    "documentoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',

    CONSTRAINT "aditivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distratos" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "dataDistrato" TIMESTAMP(3) NOT NULL,
    "motivoDistrato" TEXT NOT NULL,
    "valorDevolucao" DECIMAL(10,2),
    "documentoUrl" TEXT,

    CONSTRAINT "distratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quitacoes" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "dataQuitacao" TIMESTAMP(3) NOT NULL,
    "valorQuitacao" DECIMAL(10,2) NOT NULL,
    "documentoUrl" TEXT,

    CONSTRAINT "quitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpfCnpj_key" ON "clientes"("cpfCnpj");

-- CreateIndex
CREATE INDEX "clientes_cpfCnpj_idx" ON "clientes"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_clienteId_key" ON "enderecos"("clienteId");

-- CreateIndex
CREATE INDEX "enderecos_clienteId_idx" ON "enderecos"("clienteId");

-- CreateIndex
CREATE INDEX "enderecos_cep_idx" ON "enderecos"("cep");

-- CreateIndex
CREATE UNIQUE INDEX "contatos_clienteId_key" ON "contatos"("clienteId");

-- CreateIndex
CREATE INDEX "contatos_clienteId_idx" ON "contatos"("clienteId");

-- CreateIndex
CREATE INDEX "documentos_clienteId_idx" ON "documentos"("clienteId");

-- CreateIndex
CREATE INDEX "lotes_status_idx" ON "lotes"("status");

-- CreateIndex
CREATE INDEX "lotes_quadra_numero_idx" ON "lotes"("quadra", "numero");

-- CreateIndex
CREATE INDEX "contratos_clienteId_idx" ON "contratos"("clienteId");

-- CreateIndex
CREATE INDEX "contratos_loteId_idx" ON "contratos"("loteId");

-- CreateIndex
CREATE INDEX "contratos_status_idx" ON "contratos"("status");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_nossoNumero_key" ON "boletos"("nossoNumero");

-- CreateIndex
CREATE INDEX "boletos_clienteId_idx" ON "boletos"("clienteId");

-- CreateIndex
CREATE INDEX "boletos_contratoId_idx" ON "boletos"("contratoId");

-- CreateIndex
CREATE INDEX "boletos_status_idx" ON "boletos"("status");

-- CreateIndex
CREATE INDEX "boletos_dataVencimento_idx" ON "boletos"("dataVencimento");

-- CreateIndex
CREATE INDEX "boletos_nossoNumero_idx" ON "boletos"("nossoNumero");

-- CreateIndex
CREATE INDEX "reajustes_contratoId_idx" ON "reajustes"("contratoId");

-- CreateIndex
CREATE INDEX "reajustes_status_idx" ON "reajustes"("status");

-- CreateIndex
CREATE INDEX "reajustes_dataReferencia_idx" ON "reajustes"("dataReferencia");

-- CreateIndex
CREATE INDEX "indices_economicos_data_idx" ON "indices_economicos"("data");

-- CreateIndex
CREATE INDEX "clientes_inadimplentes_clienteId_idx" ON "clientes_inadimplentes"("clienteId");

-- CreateIndex
CREATE INDEX "clientes_inadimplentes_status_idx" ON "clientes_inadimplentes"("status");

-- CreateIndex
CREATE INDEX "clientes_inadimplentes_diasAtraso_idx" ON "clientes_inadimplentes"("diasAtraso");

-- CreateIndex
CREATE INDEX "parcelas_inadimplentes_clienteInadimplente_id_idx" ON "parcelas_inadimplentes"("clienteInadimplente_id");

-- CreateIndex
CREATE INDEX "parcelas_inadimplentes_status_idx" ON "parcelas_inadimplentes"("status");

-- CreateIndex
CREATE INDEX "interacoes_clienteId_idx" ON "interacoes"("clienteId");

-- CreateIndex
CREATE INDEX "interacoes_data_idx" ON "interacoes"("data");

-- CreateIndex
CREATE INDEX "comunicacoes_clienteId_idx" ON "comunicacoes"("clienteId");

-- CreateIndex
CREATE INDEX "comunicacoes_data_idx" ON "comunicacoes"("data");

-- CreateIndex
CREATE INDEX "comunicacoes_tipo_idx" ON "comunicacoes"("tipo");

-- CreateIndex
CREATE INDEX "modelos_mensagem_tipo_idx" ON "modelos_mensagem"("tipo");

-- CreateIndex
CREATE INDEX "aditivos_contratoId_idx" ON "aditivos"("contratoId");

-- CreateIndex
CREATE INDEX "distratos_contratoId_idx" ON "distratos"("contratoId");

-- CreateIndex
CREATE INDEX "quitacoes_contratoId_idx" ON "quitacoes"("contratoId");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reajustes" ADD CONSTRAINT "reajustes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes_inadimplentes" ADD CONSTRAINT "clientes_inadimplentes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas_inadimplentes" ADD CONSTRAINT "parcelas_inadimplentes_clienteInadimplente_id_fkey" FOREIGN KEY ("clienteInadimplente_id") REFERENCES "clientes_inadimplentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunicacoes" ADD CONSTRAINT "comunicacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aditivos" ADD CONSTRAINT "aditivos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distratos" ADD CONSTRAINT "distratos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes" ADD CONSTRAINT "quitacoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
