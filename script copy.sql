-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "tipoArquivo" TEXT NOT NULL,
    "url" TEXT,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER NOT NULL,
    "contratoId" INTEGER,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "loteamento" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "valorBase" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" SERIAL NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorEntrada" DOUBLE PRECISION NOT NULL,
    "numeroParcelas" INTEGER NOT NULL,
    "dataVencimento" INTEGER NOT NULL,
    "clausulas" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "numeroParcela" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "nossoNumero" TEXT NOT NULL,
    "linhaDigitavel" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "valorPago" DOUBLE PRECISION,
    "formaPagamento" TEXT,
    "dataCancelamento" TIMESTAMP(3),
    "comprovante" TEXT,
    "clienteId" INTEGER NOT NULL,
    "contratoId" INTEGER NOT NULL,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reajustes" (
    "id" SERIAL NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "dataAplicacao" TIMESTAMP(3),
    "parcelaReferencia" INTEGER NOT NULL,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorReajustado" DOUBLE PRECISION NOT NULL,
    "indiceBase" TEXT NOT NULL,
    "indiceAplicado" DOUBLE PRECISION NOT NULL,
    "percentualAdicional" DOUBLE PRECISION NOT NULL,
    "reajusteTotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "contratoId" INTEGER NOT NULL,

    CONSTRAINT "reajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametros_reajuste" (
    "id" SERIAL NOT NULL,
    "indiceBase" TEXT NOT NULL,
    "percentualAdicional" DOUBLE PRECISION NOT NULL,
    "intervaloParcelas" INTEGER NOT NULL,
    "alertaAntecipadoDias" INTEGER NOT NULL,

    CONSTRAINT "parametros_reajuste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indices_economicos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indices_economicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes_inadimplentes" (
    "id" SERIAL NOT NULL,
    "valorEmAberto" DOUBLE PRECISION NOT NULL,
    "diasAtraso" INTEGER NOT NULL,
    "ultimaCobranca" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "clientes_inadimplentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas_inadimplentes" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorAtualizado" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "inadimplenciaId" INTEGER NOT NULL,

    CONSTRAINT "parcelas_inadimplentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacoes" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "parcelaId" TEXT,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "interacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunicacoes" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parcela" TEXT,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "comunicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexos_comunicacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "comunicacaoId" INTEGER NOT NULL,

    CONSTRAINT "anexos_comunicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos_mensagem" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,

    CONSTRAINT "modelos_mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_gatilhos" (
    "id" SERIAL NOT NULL,
    "executarAutomaticamente" BOOLEAN NOT NULL,
    "horarioExecucao" TEXT NOT NULL,
    "diasExecucao" TEXT NOT NULL,
    "repetirCobrancas" BOOLEAN NOT NULL,
    "intervaloRepeticao" INTEGER NOT NULL,
    "limitarRepeticoes" BOOLEAN NOT NULL,
    "limiteRepeticoes" INTEGER NOT NULL,
    "gerarLog" BOOLEAN NOT NULL,

    CONSTRAINT "configuracoes_gatilhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gatilhos" (
    "id" SERIAL NOT NULL,
    "dias" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "mensagem" TEXT NOT NULL,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "gatilhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aditivos" (
    "id" SERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAssinatura" TIMESTAMP(3),
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contratoId" INTEGER NOT NULL,

    CONSTRAINT "aditivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distratos" (
    "id" SERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAssinatura" TIMESTAMP(3),
    "motivoDistrato" TEXT NOT NULL,
    "valorDevolucao" DOUBLE PRECISION,
    "conteudo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contratoId" INTEGER NOT NULL,

    CONSTRAINT "distratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quitacoes" (
    "id" SERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataQuitacao" TIMESTAMP(3) NOT NULL,
    "valorQuitacao" DOUBLE PRECISION NOT NULL,
    "descontoAplicado" DOUBLE PRECISION,
    "conteudo" TEXT NOT NULL,
    "contratoId" INTEGER NOT NULL,

    CONSTRAINT "quitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpfCnpj_key" ON "clientes"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_clienteId_key" ON "enderecos"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_nossoNumero_key" ON "boletos"("nossoNumero");

-- CreateIndex
CREATE UNIQUE INDEX "indices_economicos_codigo_key" ON "indices_economicos"("codigo");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "parcelas_inadimplentes" ADD CONSTRAINT "parcelas_inadimplentes_inadimplenciaId_fkey" FOREIGN KEY ("inadimplenciaId") REFERENCES "clientes_inadimplentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunicacoes" ADD CONSTRAINT "comunicacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexos_comunicacao" ADD CONSTRAINT "anexos_comunicacao_comunicacaoId_fkey" FOREIGN KEY ("comunicacaoId") REFERENCES "comunicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gatilhos" ADD CONSTRAINT "gatilhos_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "configuracoes_gatilhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aditivos" ADD CONSTRAINT "aditivos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distratos" ADD CONSTRAINT "distratos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quitacoes" ADD CONSTRAINT "quitacoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;