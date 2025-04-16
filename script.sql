-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CreateTable
CREATE TABLE "clientes" (
  "id" SERIAL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "cpfCnpj" TEXT NOT NULL UNIQUE,
  "dataNascimento" TIMESTAMP(3),
  "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "contatos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL UNIQUE,
  "telefones" TEXT[] NOT NULL,
  "emails" TEXT[] NOT NULL,
  CONSTRAINT "contatos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documentos" (
  "id" SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL,
  "tipo" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "arquivo" TEXT NOT NULL,
  "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "documentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lotes" (
  "id" SERIAL PRIMARY KEY,
  "numero" TEXT NOT NULL,
  "quadra" TEXT NOT NULL,
  "loteamento" TEXT NOT NULL,
  "area" DOUBLE PRECISION NOT NULL,
  "valorBase" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'disponivel'
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "parametros_reajuste" (
  "id" SERIAL PRIMARY KEY,
  "indiceBase" TEXT NOT NULL,
  "percentualAdicional" DECIMAL(6,2) NOT NULL,
  "intervaloParcelas" INTEGER NOT NULL,
  "alertaAntecipadoDias" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "indices_economicos" (
  "id" SERIAL PRIMARY KEY,
  "IGPM" DECIMAL(6,2) NOT NULL,
  "IPCA" DECIMAL(6,2) NOT NULL,
  "INPC" DECIMAL(6,2) NOT NULL,
  "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "modelos_mensagem" (
  "id" TEXT PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "distratos" (
  "id" SERIAL PRIMARY KEY,
  "contratoId" INTEGER NOT NULL,
  "dataDistrato" TIMESTAMP(3) NOT NULL,
  "motivoDistrato" TEXT NOT NULL,
  "valorDevolucao" DECIMAL(10,2),
  "documentoUrl" TEXT,
  CONSTRAINT "distratos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quitacoes" (
  "id" SERIAL PRIMARY KEY,
  "contratoId" INTEGER NOT NULL,
  "dataQuitacao" TIMESTAMP(3) NOT NULL,
  "valorQuitacao" DECIMAL(10,2) NOT NULL,
  "documentoUrl" TEXT,
  CONSTRAINT "quitacoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON UPDATE CASCADE
);

-- CreateIndexes para melhoria de performance
CREATE INDEX "clientes_cpfCnpj_idx" ON "clientes" USING btree ("cpfCnpj");
CREATE INDEX "clientes_nome_idx" ON "clientes" USING gin (to_tsvector('portuguese', unaccent("nome")));

CREATE INDEX "enderecos_clienteId_idx" ON "enderecos" USING btree ("clienteId");
CREATE INDEX "enderecos_cep_idx" ON "enderecos" USING btree ("cep");
CREATE INDEX "enderecos_cidade_idx" ON "enderecos" USING btree ("cidade");

CREATE INDEX "contatos_clienteId_idx" ON "contatos" USING btree ("clienteId");

CREATE INDEX "documentos_clienteId_idx" ON "documentos" USING btree ("clienteId");
CREATE INDEX "documentos_tipo_idx" ON "documentos" USING btree ("tipo");

CREATE INDEX "lotes_status_idx" ON "lotes" USING btree ("status");
CREATE INDEX "lotes_quadra_numero_idx" ON "lotes" USING btree ("quadra", "numero");
CREATE INDEX "lotes_loteamento_idx" ON "lotes" USING btree ("loteamento");

CREATE INDEX "contratos_clienteId_idx" ON "contratos" USING btree ("clienteId");
CREATE INDEX "contratos_loteId_idx" ON "contratos" USING btree ("loteId");
CREATE INDEX "contratos_status_idx" ON "contratos" USING btree ("status");
CREATE INDEX "contratos_dataInicio_idx" ON "contratos" USING btree ("dataInicio");
CREATE INDEX "contratos_dataFim_idx" ON "contratos" USING btree ("dataFim");

CREATE INDEX "boletos_clienteId_idx" ON "boletos" USING btree ("clienteId");
CREATE INDEX "boletos_contratoId_idx" ON "boletos" USING btree ("contratoId");
CREATE INDEX "boletos_status_idx" ON "boletos" USING btree ("status");
CREATE INDEX "boletos_dataVencimento_idx" ON "boletos" USING btree ("dataVencimento");
CREATE INDEX "boletos_nossoNumero_idx" ON "boletos" USING btree ("nossoNumero");
CREATE INDEX "boletos_status_dataVencimento_idx" ON "boletos" USING btree ("status", "dataVencimento");

CREATE INDEX "reajustes_contratoId_idx" ON "reajustes" USING btree ("contratoId");
CREATE INDEX "reajustes_status_idx" ON "reajustes" USING btree ("status");
CREATE INDEX "reajustes_dataReferencia_idx" ON "reajustes" USING btree ("dataReferencia");

CREATE INDEX "indices_economicos_data_idx" ON "indices_economicos" USING btree ("data");

CREATE INDEX "clientes_inadimplentes_clienteId_idx" ON "clientes_inadimplentes" USING btree ("clienteId");
CREATE INDEX "clientes_inadimplentes_status_idx" ON "clientes_inadimplentes" USING btree ("status");
CREATE INDEX "clientes_inadimplentes_diasAtraso_idx" ON "clientes_inadimplentes" USING btree ("diasAtraso");

CREATE INDEX "parcelas_inadimplentes_cliente_id_idx" ON "parcelas_inadimplentes" USING btree ("clienteInadimplente_id");
CREATE INDEX "parcelas_inadimplentes_status_idx" ON "parcelas_inadimplentes" USING btree ("status");
CREATE INDEX "parcelas_inadimplentes_dataVencimento_idx" ON "parcelas_inadimplentes" USING btree ("dataVencimento");

CREATE INDEX "interacoes_clienteId_idx" ON "interacoes" USING btree ("clienteId");
CREATE INDEX "interacoes_data_idx" ON "interacoes" USING btree ("data");
CREATE INDEX "interacoes_tipo_idx" ON "interacoes" USING btree ("tipo");

CREATE INDEX "comunicacoes_clienteId_idx" ON "comunicacoes" USING btree ("clienteId");
CREATE INDEX "comunicacoes_data_idx" ON "comunicacoes" USING btree ("data");
CREATE INDEX "comunicacoes_tipo_idx" ON "comunicacoes" USING btree ("tipo");

CREATE INDEX "modelos_mensagem_tipo_idx" ON "modelos_mensagem" USING btree ("tipo");

CREATE INDEX "aditivos_contratoId_idx" ON "aditivos" USING btree ("contratoId");
CREATE INDEX "distratos_contratoId_idx" ON "distratos" USING btree ("contratoId");
CREATE INDEX "quitacoes_contratoId_idx" ON "quitacoes" USING btree ("contratoId");

-- Criação de views para estatísticas frequentes
CREATE VIEW "vw_clientes_contratos" AS
SELECT 
  c.id AS cliente_id, 
  c.nome, 
  c.cpfCnpj, 
  COUNT(ct.id) AS total_contratos,
  SUM(ct.valorTotal) AS valor_total_contratos
FROM "clientes" c
LEFT JOIN "contratos" ct ON c.id = ct.clienteId
GROUP BY c.id, c.nome, c.cpfCnpj;

CREATE VIEW "vw_inadimplencia" AS
SELECT 
  c.id AS cliente_id,
  c.nome,
  ct.id AS contrato_id,
  SUM(b.valor) AS valor_em_aberto,
  MAX(EXTRACT(DAY FROM (CURRENT_TIMESTAMP - b.dataVencimento))) AS dias_atraso
FROM "clientes" c
JOIN "contratos" ct ON c.id = ct.clienteId
JOIN "boletos" b ON ct.id = b.contratoId
WHERE b.status = 'gerado' AND b.dataVencimento < CURRENT_TIMESTAMP
GROUP BY c.id, c.nome, ct.id;

-- Particionamento para tabelas de histórico
CREATE TABLE "boletos_history" (
  LIKE "boletos" INCLUDING ALL
) PARTITION BY RANGE (date_trunc('month', "dataVencimento"));

-- Criar partições para os próximos 5 anos (exemplo)
CREATE TABLE "boletos_history_2023" PARTITION OF "boletos_history"
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE "boletos_history_2024" PARTITION OF "boletos_history"
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE "boletos_history_2025" PARTITION OF "boletos_history"
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Otimizações de armazenamento
ALTER TABLE "clientes" SET (fillfactor = 90);
ALTER TABLE "contratos" SET (fillfactor = 90);
ALTER TABLE "boletos" SET (fillfactor = 80);
ALTER TABLE "lotes" SET (fillfactor = 95);

-- Trigger para atualizar automaticamente parcelas pagas no contrato
CREATE OR REPLACE FUNCTION update_parcelas_pagas()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pago' AND OLD.status != 'pago' THEN
    UPDATE "contratos" SET 
      "parcelasPagas" = "parcelasPagas" + 1
    WHERE id = NEW.contratoId;
  ELSIF NEW.status != 'pago' AND OLD.status = 'pago' THEN
    UPDATE "contratos" SET 
      "parcelasPagas" = "parcelasPagas" - 1
    WHERE id = NEW.contratoId;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_parcelas_pagas
AFTER UPDATE ON "boletos"
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_parcelas_pagas();

-- Trigger para atualizar status do lote quando contrato for criado/alterado
CREATE OR REPLACE FUNCTION update_lote_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "lotes" SET 
      "status" = 'reservado'
    WHERE id = NEW.loteId;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
    UPDATE "lotes" SET 
      "status" = 'disponivel'
    WHERE id = NEW.loteId;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_lote_status
AFTER INSERT OR UPDATE ON "contratos"
FOR EACH ROW
EXECUTE FUNCTION update_lote_status();

-- Adicionar comentários para documentação
COMMENT ON TABLE "clientes" IS 'Tabela de clientes cadastrados no sistema';
COMMENT ON TABLE "contratos" IS 'Tabela de contratos de venda de lotes';
COMMENT ON TABLE "lotes" IS 'Tabela de lotes disponíveis para venda';
COMMENT ON TABLE "boletos" IS 'Tabela de boletos gerados para cobrança de parcelas';
COMMENT ON TABLE "reajustes" IS 'Registros de reajustes aplicados a contratos';