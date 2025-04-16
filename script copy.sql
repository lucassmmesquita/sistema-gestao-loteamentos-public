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


-- Inserção de clientes
INSERT INTO "clientes" ("id", "nome", "cpfCnpj", "dataNascimento", "dataCadastro") VALUES
(3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', '123.456.789-01', '1975-05-15', '2023-10-15T14:30:00'),
(4, 'RICARDO ALVES DA SILVA', '234.567.890-12', '1980-07-22', '2023-10-16T10:15:00'),
(5, 'RAIMUNDO JOSÉ RODRIGUES DE MORAES', '345.678.901-23', '1968-03-10', '2023-10-18T09:30:00'),
(6, 'EDMILSON FARRAPO NASCIMENTO', '456.789.012-34', '1972-11-25', '2023-10-20T14:00:00'),
(7, 'ANTONIO MARCOS RODRIGUES GONÇALVES', '567.890.123-45', '1985-09-05', '2023-10-22T11:45:00'),
(8, 'FRANCISCO ARICLENES RODRIGUES DE SOUSA', '678.901.234-56', '1970-06-15', '2023-10-25T10:30:00'),
(9, 'ANTONIO PEDRO BARBOSA', '789.012.345-67', '1978-12-03', '2023-10-27T09:15:00'),
(10, 'FRANCISCO YAGO DA SILVA CASTRO', '890.123.456-78', '1982-08-18', '2023-10-30T14:45:00'),
(11, 'FRANCINEIDE LIMA DE CASTRO', '901.234.567-89', '1975-04-30', '2023-11-02T10:00:00'),
(12, 'FRANCISCO FLADIMIR PERES', '012.345.678-90', '1973-09-12', '2023-11-05T15:30:00'),
(13, 'LEONARDO DA SILVA GONÇALVES', '123.456.789-02', '1988-02-25', '2023-11-08T13:15:00'),
(14, 'ANTONIO CARLOS CAMPOS RAMOS', '234.567.890-13', '1965-07-08', '2023-11-10T09:45:00'),
(15, 'EDNA MARIA GOMES PEREIRA', '345.678.901-24', '1977-11-15', '2023-11-12T14:00:00'),
(16, 'NEUMA MARIA DE MORAES BRITO ALVES', '456.789.012-35', '1970-05-20', '2023-11-15T10:30:00'),
(17, 'FRANCISCO LUCIANO MARQUES DE PAULA', '567.890.123-46', '1982-03-17', '2023-11-18T13:45:00'),
(18, 'UENDERSON RODRIGUES DE OLIVEIRA', '678.901.234-57', '1990-10-05', '2023-11-20T09:15:00'),
(19, 'MARIA ELIANE GOMES PEREIRA', '789.012.345-68', '1975-12-10', '2023-11-22T14:30:00');

-- Inserção de endereços
INSERT INTO "enderecos" ("clienteId", "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado") VALUES
(3, '65000-000', 'Rua Principal', '123', '', 'Centro', 'São Luís', 'MA'),
(4, '65000-000', 'Avenida Central', '456', 'Apto 302', 'Jardim', 'São Luís', 'MA'),
(5, '65000-000', 'Rua das Flores', '789', '', 'Bom Jesus', 'São Luís', 'MA'),
(6, '65000-000', 'Rua dos Pássaros', '321', '', 'Cohab', 'São Luís', 'MA'),
(7, '65000-000', 'Avenida das Palmeiras', '654', '', 'Jardim América', 'São Luís', 'MA'),
(8, '65000-000', 'Rua das Mangueiras', '987', '', 'Bom Jesus', 'São Luís', 'MA'),
(9, '65000-000', 'Rua dos Ipês', '543', '', 'Centro', 'São Luís', 'MA'),
(10, '65000-000', 'Avenida dos Holandeses', '210', 'Bloco B, Apto 105', 'Calhau', 'São Luís', 'MA'),
(11, '65000-000', 'Rua do Sol', '876', '', 'Centro', 'São Luís', 'MA'),
(12, '65000-000', 'Rua da Paz', '345', '', 'Jardim América', 'São Luís', 'MA'),
(13, '65000-000', 'Rua da Alegria', '678', '', 'Cohab', 'São Luís', 'MA'),
(14, '65000-000', 'Avenida Litorânea', '901', '', 'Calhau', 'São Luís', 'MA'),
(15, '65000-000', 'Rua dos Girassóis', '432', '', 'Jardim', 'São Luís', 'MA'),
(16, '65000-000', 'Rua das Acácias', '765', '', 'Bom Jesus', 'São Luís', 'MA'),
(17, '65000-000', 'Rua das Tulipas', '123', '', 'Cohab', 'São Luís', 'MA'),
(18, '65000-000', 'Rua das Orquídeas', '456', '', 'Jardim América', 'São Luís', 'MA'),
(19, '65000-000', 'Rua dos Lírios', '789', '', 'Bom Jesus', 'São Luís', 'MA');

-- Inserção de contatos
INSERT INTO "contatos" ("clienteId", "telefones", "emails") VALUES
(3, ARRAY['(98) 98765-4321'], ARRAY['helena.santos@email.com']),
(4, ARRAY['(98) 98765-1234'], ARRAY['ricardo.silva@email.com']),
(5, ARRAY['(98) 98765-5678'], ARRAY['raimundo.moraes@email.com']),
(6, ARRAY['(98) 98765-9012'], ARRAY['edmilson.nascimento@email.com']),
(7, ARRAY['(98) 98765-3456'], ARRAY['antonio.goncalves@email.com']),
(8, ARRAY['(98) 98765-7890'], ARRAY['francisco.sousa@email.com']),
(9, ARRAY['(98) 98765-0123'], ARRAY['antonio.barbosa@email.com']),
(10, ARRAY['(98) 98765-4567'], ARRAY['francisco.castro@email.com']),
(11, ARRAY['(98) 98765-8901'], ARRAY['francineide.castro@email.com']),
(12, ARRAY['(98) 98765-2345'], ARRAY['francisco.peres@email.com']),
(13, ARRAY['(98) 98765-6789'], ARRAY['leonardo.goncalves@email.com']),
(14, ARRAY['(98) 98765-9012'], ARRAY['antonio.ramos@email.com']),
(15, ARRAY['(98) 98765-3456'], ARRAY['edna.pereira@email.com']),
(16, ARRAY['(98) 98765-7890'], ARRAY['neuma.alves@email.com']),
(17, ARRAY['(98) 98765-0123'], ARRAY['francisco.paula@email.com']),
(18, ARRAY['(98) 98765-4567'], ARRAY['uenderson.oliveira@email.com']),
(19, ARRAY['(98) 98765-8901'], ARRAY['maria.pereira@email.com']);

-- Inserção de lotes
INSERT INTO "lotes" ("id", "numero", "quadra", "loteamento", "area", "valorBase", "status") VALUES
(10, 'A-001', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(11, 'A-002', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(12, 'A-003', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(13, 'A-004', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(14, 'A-005', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(15, 'A-006', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(16, 'A-007', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(17, 'A-008', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(18, 'A-009', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(19, 'A-010', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(20, 'A-011', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(21, 'A-012', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(22, 'A-013', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(23, 'A-014', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(24, 'A-015', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(25, 'A-016', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(26, 'A-017', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido'),
(27, 'A-018', 'A', 'JCA LOTEAMENTO BOM JESUS', 250, 50000, 'vendido');

-- Inserção de contratos
INSERT INTO "contratos" ("id", "clienteId", "loteId", "dataInicio", "dataFim", "valorTotal", "valorEntrada", "numeroParcelas", "dataVencimento", "clausulas", "status", "dataCriacao", "parcelasPagas") VALUES
(10, 3, 10, '2023-01-10', '2028-01-10', 60000, 6000, 60, 10, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-01-05T14:30:00', 13),
(11, 4, 11, '2023-01-15', '2028-01-15', 60000, 6000, 60, 15, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-01-10T10:15:00', 13),
(12, 5, 12, '2023-01-20', '2028-01-20', 60000, 6000, 60, 20, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-01-15T09:15:00', 13),
(13, 6, 13, '2023-02-05', '2028-02-05', 60000, 6000, 60, 5, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-01-30T11:30:00', 13),
(14, 7, 14, '2023-02-10', '2028-02-10', 60000, 6000, 60, 10, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-02-05T15:00:00', 10),
(15, 8, 15, '2023-02-15', '2028-02-15', 60000, 6000, 60, 15, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-02-10T10:45:00', 12),
(16, 9, 16, '2023-02-20', '2028-02-20', 60000, 6000, 60, 20, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-02-15T13:20:00', 13),
(17, 9, 17, '2023-03-05', '2028-03-05', 60000, 6000, 60, 5, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-02-28T09:00:00', 13),
(18, 10, 18, '2023-03-10', '2028-03-10', 60000, 6000, 60, 10, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-03-05T14:30:00', 13),
(19, 11, 19, '2023-03-15', '2028-03-15', 60000, 6000, 60, 15, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-03-10T11:15:00', 12),
(20, 12, 20, '2023-03-20', '2028-03-20', 60000, 6000, 60, 20, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-03-15T15:45:00', 11),
(21, 13, 21, '2023-04-05', '2028-04-05', 60000, 6000, 60, 5, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-03-30T10:30:00', 12),
(22, 14, 22, '2023-04-10', '2028-04-10', 60000, 6000, 60, 10, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-04-05T13:00:00', 12),
(23, 15, 23, '2023-04-15', '2028-04-15', 60000, 6000, 60, 15, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-04-10T09:45:00', 11),
(24, 16, 24, '2023-04-20', '2028-04-20', 60000, 6000, 60, 20, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-04-15T14:15:00', 12),
(25, 17, 25, '2023-05-05', '2028-05-05', 60000, 6000, 60, 5, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-04-30T11:30:00', 12),
(26, 18, 26, '2023-05-10', '2028-05-10', 60000, 6000, 60, 10, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-05-05T15:00:00', 12),
(27, 19, 27, '2023-05-15', '2028-05-15', 60000, 6000, 60, 15, 'Contrato de compra e venda de lote no JCA LOTEAMENTO BOM JESUS.', 'ativo', '2023-05-10T10:45:00', 12);

-- Inserção de boletos
INSERT INTO "boletos" ("id", "clienteId", "clienteNome", "contratoId", "valor", "dataVencimento", "numeroParcela", "descricao", "nossoNumero", "linhaDigitavel", "codigoBarras", "pdfUrl", "dataGeracao", "status", "dataPagamento", "valorPago", "formaPagamento", "dataCancelamento") VALUES
(10, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2023-05-10', 5, 'Parcela 5 - Contrato 10 - JCA LOTEAMENTO BOM JESUS', '10492576843298777775', '10492.57684 32987.777751 00000.000174 8 92380000090000', '10498923800000900002576843298777775000000017', 'https://api.caixa.gov.br/boletos/10492576843298777775/pdf', '2023-04-10T14:30:00.000Z', 'pago', '2023-05-08T10:20:00.000Z', 900, 'transferencia', NULL),
(11, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2023-06-10', 6, 'Parcela 6 - Contrato 10 - JCA LOTEAMENTO BOM JESUS', '10492576843298777776', '10492.57684 32987.777761 00000.000174 8 92660000090000', '10498926600000900002576843298777776000000017', 'https://api.caixa.gov.br/boletos/10492576843298777776/pdf', '2023-05-10T14:30:00.000Z', 'pago', '2023-06-09T15:45:00.000Z', 900, 'pix', NULL),
(12, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2023-07-10', 7, 'Parcela 7 - Contrato 10 - JCA LOTEAMENTO BOM JESUS', '10492576843298777777', '10492.57684 32987.777777 00000.000174 8 92940000090000', '10498929400000900002576843298777777000000017', 'https://api.caixa.gov.br/boletos/10492576843298777777/pdf', '2023-06-10T14:30:00.000Z', 'pago', '2023-07-07T11:20:00.000Z', 900, 'transferencia', NULL),
(13, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2024-04-10', 16, 'Parcela 16 - Contrato 10 - JCA LOTEAMENTO BOM JESUS', '10492576843298777786', '10492.57684 32987.777868 00000.000174 8 94570000090000', '10498945700000900002576843298777786000000017', 'https://api.caixa.gov.br/boletos/10492576843298777786/pdf', '2024-03-10T14:30:00.000Z', 'gerado', NULL, NULL, NULL, NULL),
(14, 4, 'RICARDO ALVES DA SILVA', 11, 900, '2024-04-15', 16, 'Parcela 16 - Contrato 11 - JCA LOTEAMENTO BOM JESUS', '10492576843298777801', '10492.57684 32987.778011 00000.000174 8 94600000090000', '10498946000000900002576843298777801000000017', 'https://api.caixa.gov.br/boletos/10492576843298777801/pdf', '2024-03-15T14:30:00.000Z', 'gerado', NULL, NULL, NULL, NULL),
(15, 5, 'RAIMUNDO JOSÉ RODRIGUES DE MORAES', 12, 900, '2024-04-20', 16, 'Parcela 16 - Contrato 12 - JCA LOTEAMENTO BOM JESUS', '10492576843298777816', '10492.57684 32987.778169 00000.000174 8 94650000090000', '10498946500000900002576843298777816000000017', 'https://api.caixa.gov.br/boletos/10492576843298777816/pdf', '2024-03-20T14:30:00.000Z', 'gerado', NULL, NULL, NULL, NULL),
(16, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2024-05-05', 16, 'Parcela 16 - Contrato 13 - JCA LOTEAMENTO BOM JESUS', '10492576843298777831', '10492.57684 32987.778312 00000.000174 8 94800000090000', '10498948000000900002576843298777831000000017', 'https://api.caixa.gov.br/boletos/10492576843298777831/pdf', '2024-04-05T14:30:00.000Z', 'gerado', NULL, NULL, NULL, NULL),
(17, 7, 'ANTONIO MARCOS RODRIGUES GONÇALVES', 14, 900, '2023-12-10', 11, 'Parcela 11 - Contrato 14 - JCA LOTEAMENTO BOM JESUS', '10492576843298777846', '10492.57684 32987.778466 00000.000174 8 93800000090000', '10498938000000900002576843298777846000000017', 'https://api.caixa.gov.br/boletos/10492576843298777846/pdf', '2023-11-10T14:30:00.000Z', 'vencido', NULL, NULL, NULL, NULL),
(18, 8, 'FRANCISCO ARICLENES RODRIGUES DE SOUSA', 15, 900, '2023-11-15', 10, 'Parcela 10 - Contrato 15 - JCA LOTEAMENTO BOM JESUS', '10492576843298777861', '10492.57684 32987.778617 00000.000174 8 93520000090000', '10498935200000900002576843298777861000000017', 'https://api.caixa.gov.br/boletos/10492576843298777861/pdf', '2023-10-15T14:30:00.000Z', 'cancelado', NULL, NULL, NULL, '2023-11-10T09:15:00.000Z'),
(19, 9, 'ANTONIO PEDRO BARBOSA', 16, 900, '2024-03-20', 13, 'Parcela 13 - Contrato 16 - JCA LOTEAMENTO BOM JESUS', '10492576843298777876', '10492.57684 32987.778763 00000.000174 8 94450000090000', '10498944500000900002576843298777876000000017', 'https://api.caixa.gov.br/boletos/10492576843298777876/pdf', '2024-02-20T14:30:00.000Z', 'pago', '2024-03-18T11:20:00.000Z', 900, 'pix', NULL),
(20, 10, 'FRANCISCO YAGO DA SILVA CASTRO', 18, 900, '2024-04-10', 14, 'Parcela 14 - Contrato 18 - JCA LOTEAMENTO BOM JESUS', '10492576843298777891', '10492.57684 32987.778912 00000.000174 8 94570000090000', '10498945700000900002576843298777891000000017', 'https://api.caixa.gov.br/boletos/10492576843298777891/pdf', '2024-03-10T14:30:00.000Z', 'gerado', NULL, NULL, NULL, NULL),
(21, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-05-01', 1, 'Parcela 1 - Contrato 10', '73380511330', '10492.73380.51133.0.3868', '1046.079497115128366e+40', 'https://api.caixa.gov.br/boletos/73380511330/pdf', '2025-04-15T19:41:48.204Z', 'gerado', NULL, NULL, NULL, NULL),
(22, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-05-31', 2, 'Parcela 2 - Contrato 10', '44119078702', '10492.44119.07870.2.2437', '1046.620509806933973e+40', 'https://api.caixa.gov.br/boletos/44119078702/pdf', '2025-04-15T19:41:48.757Z', 'gerado', NULL, NULL, NULL, NULL),
(23, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-07-01', 3, 'Parcela 3 - Contrato 10', '85843691102', '10492.85843.69110.2.8275', '1045.624965839482129e+40', 'https://api.caixa.gov.br/boletos/85843691102/pdf', '2025-04-15T19:41:49.300Z', 'gerado', NULL, NULL, NULL, NULL),
(24, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-07-31', 4, 'Parcela 4 - Contrato 10', '17018454461', '10492.17018.45446.1.6778', '1041.805164417698763e+40', 'https://api.caixa.gov.br/boletos/17018454461/pdf', '2025-04-15T19:41:49.887Z', 'gerado', NULL, NULL, NULL, NULL),
(25, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-08-31', 5, 'Parcela 5 - Contrato 10', '70367610318', '10492.70367.61031.8.7159', '1043.8714628213370435e+40', 'https://api.caixa.gov.br/boletos/70367610318/pdf', '2025-04-15T19:41:50.473Z', 'gerado', NULL, NULL, NULL, NULL),
(26, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-10-01', 6, 'Parcela 6 - Contrato 10', '96666980129', '10492.96666.98012.9.3252', '1049.198231263408204e+40', 'https://api.caixa.gov.br/boletos/96666980129/pdf', '2025-04-15T19:41:51.054Z', 'gerado', NULL, NULL, NULL, NULL),
(27, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-10-31', 7, 'Parcela 7 - Contrato 10', '22505805345', '10492.22505.80534.5.6479', '1046.936807940387598e+40', 'https://api.caixa.gov.br/boletos/22505805345/pdf', '2025-04-15T19:41:51.624Z', 'gerado', NULL, NULL, NULL, NULL),
(28, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-12-01', 8, 'Parcela 8 - Contrato 10', '50731953715', '10492.50731.95371.5.3844', '1048.885025843718086e+40', 'https://api.caixa.gov.br/boletos/50731953715/pdf', '2025-04-15T19:41:52.213Z', 'gerado', NULL, NULL, NULL, NULL),
(29, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2025-12-31', 9, 'Parcela 9 - Contrato 10', '13225417761', '10492.13225.41776.1.7688', '1044.721715072771346e+40', 'https://api.caixa.gov.br/boletos/13225417761/pdf', '2025-04-15T19:41:52.773Z', 'cancelado', NULL, NULL, NULL, '2025-04-15T19:46:41.664Z'),
(30, 3, 'HELENA MARIA MACIEL PINEO DOS SANTOS', 10, 900, '2026-01-31', 10, 'Parcela 10 - Contrato 10', '16536261965', '10492.16536.26196.5.8615', '1045.916754402854554e+40', 'https://api.caixa.gov.br/boletos/16536261965/pdf', '2025-04-15T19:41:53.356Z', 'pago', '2025-04-15', 900, 'transferencia', NULL),
(31, 5, 'RAIMUNDO JOSÉ RODRIGUES DE MORAES', 12, 900, '2025-05-15', 1, 'Parcela 1 - Contrato 12', '85454715675', '10492.85454.71567.5.9487', '1041.4887608864504516e+40', 'https://api.caixa.gov.br/boletos/85454715675/pdf', '2025-04-15T19:47:01.676Z', 'gerado', NULL, NULL, NULL, NULL),
(32, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-05-01', 20, 'Parcela 20 - Contrato 13', '91018468259', '10492.91018.46825.9.5098', '1043.656009035545286e+40', 'https://api.caixa.gov.br/boletos/91018468259/pdf', '2025-04-15T19:47:40.275Z', 'gerado', NULL, NULL, NULL, NULL),
(33, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-05-31', 21, 'Parcela 21 - Contrato 13', '60339094632', '10492.60339.09463.2.2408', '1049.731165809201204e+40', 'https://api.caixa.gov.br/boletos/60339094632/pdf', '2025-04-15T19:47:40.858Z', 'gerado', NULL, NULL, NULL, NULL),
(34, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-07-01', 22, 'Parcela 22 - Contrato 13', '88723843757', '10492.88723.84375.7.2104', '1048.510171382708337e+40', 'https://api.caixa.gov.br/boletos/88723843757/pdf', '2025-04-15T19:47:41.465Z', 'gerado', NULL, NULL, NULL, NULL),
(35, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-07-31', 23, 'Parcela 23 - Contrato 13', '51356430919', '10492.51356.43091.9.5840', '1043.840553411666909e+40', 'https://api.caixa.gov.br/boletos/51356430919/pdf', '2025-04-15T19:47:42.008Z', 'gerado', NULL, NULL, NULL, NULL),
(36, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-08-31', 24, 'Parcela 24 - Contrato 13', '14811409093', '10492.14811.40909.3.9925', '1049.070204826005121e+40', 'https://api.caixa.gov.br/boletos/14811409093/pdf', '2025-04-15T19:47:42.586Z', 'gerado', NULL, NULL, NULL, NULL),
(37, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-10-01', 25, 'Parcela 25 - Contrato 13', '96993039138', '10492.96993.03913.8.8652', '1043.1478358143268315e+40', 'https://api.caixa.gov.br/boletos/96993039138/pdf', '2025-04-15T19:47:43.174Z', 'gerado', NULL, NULL, NULL, NULL),
(38, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-10-31', 26, 'Parcela 26 - Contrato 13', '78519004998', '10492.78519.00499.8.7282', '1044.911157619009802e+40', 'https://api.caixa.gov.br/boletos/78519004998/pdf', '2025-04-15T19:47:43.775Z', 'gerado', NULL, NULL, NULL, NULL),
(39, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-12-01', 27, 'Parcela 27 - Contrato 13', '52544101237', '10492.52544.10123.7.5499', '1048.565193936316421e+40', 'https://api.caixa.gov.br/boletos/52544101237/pdf', '2025-04-15T19:47:44.375Z', 'gerado', NULL, NULL, NULL, NULL),
(40, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2025-12-31', 28, 'Parcela 28 - Contrato 13', '54743085596', '10492.54743.08559.6.8189', '1049.959542958479735e+40', 'https://api.caixa.gov.br/boletos/54743085596/pdf', '2025-04-15T19:47:44.947Z', 'gerado', NULL, NULL, NULL, NULL),
(41, 6, 'EDMILSON FARRAPO NASCIMENTO', 13, 900, '2026-01-31', 29, 'Parcela 29 - Contrato 13', '42825822755', '10492.42825.82275.5.2721', '1041.7002137232289743e+40', 'https://api.caixa.gov.br/boletos/42825822755/pdf', '2025-04-15T19:47:45.533Z', 'gerado', NULL, NULL, NULL, NULL),
(42, 7, 'ANTONIO MARCOS RODRIGUES GONÇALVES', 14, 900, '2025-05-16', 1, 'Parcela 1 - Contrato 14', '24432846748', '10492.24432.84674.8.7848', '1044.48568675667116e+40', 'https://api.caixa.gov.br/boletos/24432846748/pdf', '2025-04-16T11:00:44.602Z', 'gerado', NULL, NULL, NULL, NULL);

-- Inserção de dados nas tabelas de parâmetros
INSERT INTO "parametros_reajuste" ("id", "indiceBase", "percentualAdicional", "intervaloParcelas", "alertaAntecipadoDias") VALUES
(1, 'IGPM', 6, 12, 30);

-- Inserção de índices econômicos
INSERT INTO "indices_economicos" ("id", "IGPM", "IPCA", "INPC", "data") VALUES
(1, 5.5, 4.2, 3.8, '2025-04-01');

-- Inserção de dados de clientes inadimplentes
INSERT INTO "clientes_inadimplentes" ("id", "clienteId", "contratoId", "valorEmAberto", "diasAtraso", "ultimaCobranca", "status") VALUES
(1, 3, 10, 945.67, 2, '2024-04-08T10:15:00', 'em_aberto'),
(2, 4, 11, 900, 0, '2024-04-05T14:30:00', 'em_aberto'),
(3, 5, 12, 900, 0, NULL, 'em_aberto'),
(4, 6, 13, 900, 0, NULL, 'em_aberto'),
(5, 7, 14, 4115.31, 123, '2024-03-20T09:45:00', 'atrasado'),
(6, 9, 16, 900, 0, '2024-04-10T15:20:00', 'parcial'),
(7, 10, 18, 923.45, 2, '2024-04-05T11:30:00', 'em_aberto'),
(8, 11, 19, 1867.88, 28, '2024-04-01T13:45:00', 'atrasado'),
(9, 12, 20, 1945.99, 52, '2024-03-30T10:15:00', 'atrasado'),
(10, 15, 23, 965.78, 28, '2024-04-05T16:30:00', 'atrasado');

-- Inserção de parcelas inadimplentes
INSERT INTO "parcelas_inadimplentes" ("id", "clienteInadimplente_id", "numero", "dataVencimento", "valor", "valorAtualizado", "status") VALUES
(1, 1, 16, '2024-04-10', 900, 945.67, 'em_aberto'),
(2, 2, 16, '2024-04-15', 900, 900, 'em_aberto'),
(3, 3, 16, '2024-04-20', 900, 900, 'em_aberto'),
(4, 4, 16, '2024-05-05', 900, 900, 'em_aberto'),
(5, 5, 11, '2023-12-10', 900, 1078.45, 'atrasado'),
(6, 5, 12, '2024-01-10', 900, 1045.87, 'atrasado'),
(7, 5, 13, '2024-02-10', 900, 1012.65, 'atrasado'),
(8, 5, 14, '2024-03-10', 900, 978.34, 'atrasado'),
(9, 6, 14, '2024-04-20', 900, 900, 'em_aberto'),
(10, 7, 14, '2024-04-10', 900, 923.45, 'em_aberto'),
(11, 8, 13, '2024-03-15', 900, 967.88, 'atrasado'),
(12, 8, 14, '2024-04-15', 900, 900, 'em_aberto'),
(13, 9, 12, '2024-02-20', 900, 989.65, 'atrasado'),
(14, 9, 13, '2024-03-20', 900, 956.34, 'atrasado'),
(15, 10, 13, '2024-03-15', 900, 965.78, 'atrasado');

-- Inserção de interações
INSERT INTO "interacoes" ("id", "clienteId", "tipo", "data", "observacao", "usuario", "parcelaId") VALUES
('i001', 7, 'telefone', '2024-03-20T09:45:00', 'Cliente informou que está com dificuldades financeiras e prometeu fazer um pagamento parcial até o final do mês. Ficou de retornar com uma proposta de acordo para parcelamento do débito.', 'Maria Oliveira', 'p005'),
('i002', 7, 'email', '2024-03-15T14:30:00', 'Enviado e-mail com demonstrativo de débito e opções de parcelamento. Sem resposta até o momento.', 'Carlos Silva', 'p005'),
('i003', 7, 'whatsapp', '2024-03-10T11:20:00', 'Mensagem enviada por WhatsApp com informações sobre as parcelas em atraso. Cliente visualizou mas não respondeu.', 'Carlos Silva', NULL),
('i004', 11, 'email', '2024-04-01T13:45:00', 'Enviado e-mail de cobrança da parcela de março e aviso de vencimento da parcela de abril.', 'Maria Oliveira', 'p011'),
('i005', 12, 'telefone', '2024-03-30T10:15:00', 'Cliente não atendeu. Deixada mensagem na caixa postal.', 'João Santos', 'p013'),
('i006', 12, 'presencial', '2024-03-25T09:30:00', 'Cliente compareceu ao escritório e informou que está desempregado. Solicitou prazo adicional para pagamento.', 'Amanda Sousa', NULL);

-- Inserção de comunicações
INSERT INTO "comunicacoes" ("id", "clienteId", "tipo", "data", "mensagem", "status", "parcelaInfo", "anexos") VALUES
('c001', 7, 'email', '2024-03-15T14:30:00', 'Prezado Sr. Antonio Marcos, identificamos parcelas em atraso em seu contrato. Entre em contato para regularizar sua situação e evitar novos encargos.', 'enviado', '{"id": "p005", "numero": 11}', '[]'),
('c002', 7, 'whatsapp', '2024-03-10T11:20:00', 'Olá Sr. Antonio Marcos. Identificamos parcelas em atraso no seu contrato. Por favor, entre em contato para regularização.', 'enviado', NULL, '[]'),
('c003', 11, 'email', '2024-04-01T13:45:00', 'Prezada Sra. Francineide, lembramos que a parcela de março está em atraso e a parcela de abril vencerá em breve. Entre em contato para regularizar sua situação.', 'enviado', '{"id": "p011", "numero": 13}', '[{"nome": "boleto_marco.pdf", "tipo": "application/pdf"}, {"nome": "boleto_abril.pdf", "tipo": "application/pdf"}]'),
('c004', 10, 'sms', '2024-04-05T11:30:00', 'Lembrete: Sua parcela vence em 5 dias. Evite juros pagando em dia.', 'enviado', '{"id": "p010", "numero": 14}', '[]'),
('c005', 15, 'email', '2024-04-05T16:30:00', 'Prezada Sra. Edna, sua parcela encontra-se em atraso há 20 dias. Entre em contato para regularizar sua situação e evitar inclusão nos órgãos de proteção ao crédito.', 'enviado', '{"id": "p015", "numero": 13}', '[{"nome": "boleto_atualizado.pdf", "tipo": "application/pdf"}]');

-- Inserção de modelos de mensagem
INSERT INTO "modelos_mensagem" ("id", "nome", "tipo", "conteudo") VALUES
('m001', 'Lembrete de Vencimento', 'email', 'Prezado(a) {nome},\n\nGostaríamos de lembrá-lo(a) que a parcela {parcela} do seu contrato {contrato} vencerá em {diasVencimento} dias, no dia {vencimento}, no valor de {valor}.\n\nPor favor, efetue o pagamento em dia para evitar juros e multas.\n\nEm caso de dúvidas, estamos à disposição.\n\nAtenciosamente,\nEquipe de Cobrança'),
('m002', 'Primeira Cobrança', 'email', 'Prezado(a) {nome},\n\nInformamos que a parcela {parcela} do seu contrato {contrato}, com vencimento em {vencimento}, no valor de {valor}, encontra-se em atraso há {diasAtraso} dias.\n\nPor favor, regularize sua situação o mais breve possível para evitar maiores encargos e possíveis restrições cadastrais.\n\nCaso já tenha efetuado o pagamento, por favor, desconsidere este aviso.\n\nAtenciosamente,\nEquipe de Cobrança'),
('m003', 'Segunda Cobrança', 'email', 'Prezado(a) {nome},\n\nReiteramos que a parcela {parcela} do seu contrato {contrato}, com vencimento em {vencimento}, no valor de {valor}, permanece em aberto há {diasAtraso} dias.\n\nSolicitamos a regularização imediata para evitar a inclusão de seu nome nos órgãos de proteção ao crédito, o que ocorrerá em 5 dias úteis caso o débito não seja quitado.\n\nEntre em contato conosco para negociação.\n\nAtenciosamente,\nSetor de Cobrança'),
('m004', 'Cobrança Final', 'email', 'Prezado(a) {nome},\n\nNotificamos que a parcela {parcela} do seu contrato {contrato}, com vencimento em {vencimento}, no valor atualizado de {valorAtualizado}, permanece em aberto há {diasAtraso} dias.\n\nInformamos que seu nome será incluído nos órgãos de proteção ao crédito em 48 horas, e seu caso será encaminhado ao setor jurídico para as providências cabíveis.\n\nAinda é possível evitar essas medidas entrando em contato imediatamente para negociação.\n\nAtenciosamente,\nSetor Jurídico'),
('m005', 'Lembrete de Vencimento', 'sms', 'Lembrete: Parcela {parcela} do contrato {contrato} vence em {diasVencimento} dias. Valor: {valor}. Evite juros pagando em dia.'),
('m006', 'Cobrança Simples', 'sms', 'Parcela {parcela} em atraso há {diasAtraso} dias. Valor: {valorAtualizado}. Entre em contato: (98) 3xxx-xxxx.'),
('m007', 'Lembrete de Vencimento', 'whatsapp', 'Olá {nome}! Gostaríamos de lembrá-lo(a) que a parcela {parcela} do seu contrato {contrato} vencerá em {diasVencimento} dias, no valor de {valor}. Evite juros pagando em dia. Precisa de ajuda? Estamos à disposição!'),
('m008', 'Cobrança com Link', 'whatsapp', 'Olá {nome}! A parcela {parcela} do seu contrato encontra-se em atraso há {diasAtraso} dias. Valor atualizado: {valorAtualizado}. Para sua comodidade, você pode pagar pelo link: {link}\n\nPrecisa de um novo boleto ou deseja negociar? Responda esta mensagem.');

-- Inserção de configuração de gatilhos
INSERT INTO "configuracao_gatilhos" ("id", "executarAutomaticamente", "horarioExecucao", "diasExecucao", "repetirCobrancas", "intervaloRepeticao", "limitarRepeticoes", "limiteRepeticoes", "gerarLog", "gatilhos") VALUES
(1, true, '03:00', ARRAY['1', '15'], true, 7, true, 3, true, '[{"dias": 7, "tipo": "email", "ativo": true, "mensagem": "Prezado cliente, identificamos que você possui uma parcela com vencimento em 7 dias. Por favor, efetue o pagamento em dia para evitar juros e multas."}, {"dias": 15, "tipo": "sms", "ativo": true, "mensagem": "Sua parcela está em atraso há 15 dias. Entre em contato conosco para regularização."}, {"dias": 30, "tipo": "whatsapp", "ativo": true, "mensagem": "Importante: Parcela em atraso há 30 dias. Acesse o link para regularizar sua situação e evitar negativação do seu CPF."}]');

-- Ajuste das sequências para evitar conflitos de ID ao inserir novos registros
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes), true);
SELECT setval('lotes_id_seq', (SELECT MAX(id) FROM lotes), true);
SELECT setval('contratos_id_seq', (SELECT MAX(id) FROM contratos), true);
SELECT setval('boletos_id_seq', (SELECT MAX(id) FROM boletos), true);
SELECT setval('clientes_inadimplentes_id_seq', (SELECT MAX(id) FROM clientes_inadimplentes), true);
SELECT setval('parcelas_inadimplentes_id_seq', (SELECT MAX(id) FROM parcelas_inadimplentes), true);