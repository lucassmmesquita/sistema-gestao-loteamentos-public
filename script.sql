-- Database: gestlotes

-- DROP DATABASE IF EXISTS gestlotes;

CREATE DATABASE gestlotes
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en-US'
    LC_CTYPE = 'en-US'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Tabela de clientes
CREATE TABLE "clientes" (
  "id" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "cpfCnpj" TEXT NOT NULL UNIQUE,
  "dataNascimento" TIMESTAMP(3),
  "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de endereços
CREATE TABLE "enderecos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL UNIQUE,
  "cep" TEXT NOT NULL,
  "logradouro" TEXT NOT NULL,
  "numero" TEXT NOT NULL,
  "complemento" TEXT,
  "bairro" TEXT NOT NULL,
  "cidade" TEXT NOT NULL,
  "estado" TEXT NOT NULL,
  CONSTRAINT "enderecos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de contatos
CREATE TABLE "contatos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL UNIQUE,
  "telefones" TEXT[] NOT NULL,
  "emails" TEXT[] NOT NULL,
  CONSTRAINT "contatos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de documentos
CREATE TABLE "documentos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "tipo" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "arquivo" TEXT NOT NULL,
  "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "documentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de lotes
CREATE TABLE "lotes" (
  "id" SERIAL PRIMARY KEY,
  "numero" TEXT NOT NULL,
  "quadra" TEXT NOT NULL,
  "loteamento" TEXT NOT NULL,
  "area" DOUBLE PRECISION NOT NULL,
  "valorBase" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'disponivel'
);

-- Tabela de contratos
CREATE TABLE "contratos" (
  "id" SERIAL PRIMARY KEY,
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
  CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON UPDATE CASCADE,
  CONSTRAINT "contratos_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON UPDATE CASCADE
);

-- Tabela de boletos
CREATE TABLE "boletos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "clienteNome" TEXT NOT NULL,
  "contratoId" INTEGER NOT NULL,
  "valor" DECIMAL(10,2) NOT NULL,
  "dataVencimento" TIMESTAMP(3) NOT NULL,
  "numeroParcela" INTEGER NOT NULL,
  "descricao" TEXT NOT NULL,
  "nossoNumero" TEXT NOT NULL UNIQUE,
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
  CONSTRAINT "boletos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON UPDATE CASCADE,
  CONSTRAINT "boletos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- Tabela de boletos históricos (versão corrigida)
-- Observe que removemos a restrição PRIMARY KEY da tabela particionada
CREATE TABLE "boletos_history" (
  "id" INTEGER NOT NULL,
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
  "comprovante" TEXT
) PARTITION BY RANGE ("dataVencimento");

-- Criar partições para os próximos 3 anos
CREATE TABLE "boletos_history_2023" PARTITION OF "boletos_history"
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE "boletos_history_2024" PARTITION OF "boletos_history"
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE "boletos_history_2025" PARTITION OF "boletos_history"
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Criar índice único na tabela particionada incluindo a coluna de particionamento
CREATE UNIQUE INDEX "boletos_history_id_dataVencimento_idx" ON "boletos_history" ("id", "dataVencimento");

-- Tabela de reajustes
CREATE TABLE "reajustes" (
  "id" SERIAL PRIMARY KEY,
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
  CONSTRAINT "reajustes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- Tabela de parâmetros de reajuste
CREATE TABLE "parametros_reajuste" (
  "id" SERIAL PRIMARY KEY,
  "indiceBase" TEXT NOT NULL,
  "percentualAdicional" DECIMAL(6,2) NOT NULL,
  "intervaloParcelas" INTEGER NOT NULL,
  "alertaAntecipadoDias" INTEGER NOT NULL
);

-- Tabela de índices econômicos
CREATE TABLE "indices_economicos" (
  "id" SERIAL PRIMARY KEY,
  "IGPM" DECIMAL(6,2) NOT NULL,
  "IPCA" DECIMAL(6,2) NOT NULL,
  "INPC" DECIMAL(6,2) NOT NULL,
  "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes inadimplentes
CREATE TABLE "clientes_inadimplentes" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "contratoId" INTEGER NOT NULL,
  "valorEmAberto" DECIMAL(10,2) NOT NULL,
  "diasAtraso" INTEGER NOT NULL,
  "ultimaCobranca" TIMESTAMP(3),
  "status" TEXT NOT NULL,
  CONSTRAINT "clientes_inadimplentes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON UPDATE CASCADE
);

-- Tabela de parcelas inadimplentes
CREATE TABLE "parcelas_inadimplentes" (
  "id" SERIAL PRIMARY KEY,
  "clienteInadimplente_id" INTEGER NOT NULL,
  "numero" INTEGER NOT NULL,
  "dataVencimento" TIMESTAMP(3) NOT NULL,
  "valor" DECIMAL(10,2) NOT NULL,
  "valorAtualizado" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL,
  CONSTRAINT "parcelas_inadimplentes_clienteInadimplente_id_fkey" FOREIGN KEY ("clienteInadimplente_id") REFERENCES "clientes_inadimplentes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de interações
CREATE TABLE "interacoes" (
  "id" TEXT PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "tipo" TEXT NOT NULL,
  "data" TIMESTAMP(3) NOT NULL,
  "observacao" TEXT NOT NULL,
  "usuario" TEXT NOT NULL,
  "parcelaId" TEXT,
  CONSTRAINT "interacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON UPDATE CASCADE
);

-- Tabela de comunicações
CREATE TABLE "comunicacoes" (
  "id" TEXT PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "tipo" TEXT NOT NULL,
  "data" TIMESTAMP(3) NOT NULL,
  "mensagem" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "parcelaInfo" JSONB,
  "anexos" JSONB,
  CONSTRAINT "comunicacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON UPDATE CASCADE
);

-- Tabela de modelos de mensagem
CREATE TABLE "modelos_mensagem" (
  "id" TEXT PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL
);

-- Tabela de configuração de gatilhos
CREATE TABLE "configuracao_gatilhos" (
  "id" SERIAL PRIMARY KEY,
  "executarAutomaticamente" BOOLEAN NOT NULL DEFAULT true,
  "horarioExecucao" TEXT NOT NULL,
  "diasExecucao" TEXT[] NOT NULL,
  "repetirCobrancas" BOOLEAN NOT NULL DEFAULT true,
  "intervaloRepeticao" INTEGER NOT NULL DEFAULT 7,
  "limitarRepeticoes" BOOLEAN NOT NULL DEFAULT true,
  "limiteRepeticoes" INTEGER NOT NULL DEFAULT 3,
  "gerarLog" BOOLEAN NOT NULL DEFAULT true,
  "gatilhos" JSONB NOT NULL
);

-- Tabela de aditivos
CREATE TABLE "aditivos" (
  "id" SERIAL PRIMARY KEY,
  "contratoId" INTEGER NOT NULL,
  "tipo" TEXT NOT NULL,
  "dataAssinatura" TIMESTAMP(3) NOT NULL,
  "motivoAditivo" TEXT NOT NULL,
  "novoValor" DECIMAL(10,2),
  "novaDataFim" TIMESTAMP(3),
  "documentoUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ativo',
  CONSTRAINT "aditivos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- Tabela de distratos
CREATE TABLE "distratos" (
  "id" SERIAL PRIMARY KEY,
  "contratoId" INTEGER NOT NULL,
  "dataDistrato" TIMESTAMP(3) NOT NULL,
  "motivoDistrato" TEXT NOT NULL,
  "valorDevolucao" DECIMAL(10,2),
  "documentoUrl" TEXT,
  CONSTRAINT "distratos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- Tabela de quitações
CREATE TABLE "quitacoes" (
  "id" SERIAL PRIMARY KEY,
  "contratoId" INTEGER NOT NULL,
  "dataQuitacao" TIMESTAMP(3) NOT NULL,
  "valorQuitacao" DECIMAL(10,2) NOT NULL,
  "documentoUrl" TEXT,
  CONSTRAINT "quitacoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- Índices básicos
CREATE INDEX "clientes_cpfCnpj_idx" ON "clientes" USING btree ("cpfCnpj");
CREATE INDEX "enderecos_clienteId_idx" ON "enderecos" USING btree ("clienteId");
CREATE INDEX "lotes_status_idx" ON "lotes" USING btree ("status");
CREATE INDEX "contratos_clienteId_idx" ON "contratos" USING btree ("clienteId");
CREATE INDEX "contratos_loteId_idx" ON "contratos" USING btree ("loteId");
CREATE INDEX "boletos_contratoId_idx" ON "boletos" USING btree ("contratoId");
CREATE INDEX "boletos_status_idx" ON "boletos" USING btree ("status");
CREATE INDEX "boletos_dataVencimento_idx" ON "boletos" USING btree ("dataVencimento");