-- =============================================================
-- SCRIPT DDL - SISTEMA DE GESTÃO ONG MORADIA DIGNA
-- =============================================================

-- 1. LIMPEZA (Opcional: remove tabelas/types se já existirem para evitar erros ao recriar)
DROP TABLE IF EXISTS doacoes_bazar;
DROP TABLE IF EXISTS reservas_talharim;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS usuario_painel_adm;
DROP TYPE IF EXISTS tipo_evento_enum;
DROP TYPE IF EXISTS status_evento_enum;
DROP TYPE IF EXISTS status_reserva_enum;
DROP TYPE IF EXISTS status_retirada_enum;
DROP TYPE IF EXISTS status_pagamento_enum;
DROP TYPE IF EXISTS status_doacao_enum;

-- =========================
-- CRIAÇÃO DE TIPOS ENUM
-- =========================
CREATE TYPE tipo_evento_enum AS ENUM ('talharim', 'bazar');
CREATE TYPE status_evento_enum AS ENUM ('ativo', 'inativo');
CREATE TYPE status_reserva_enum AS ENUM ('ativa', 'cancelada');
CREATE TYPE status_retirada_enum AS ENUM ('nao_retirado', 'retirado');
CREATE TYPE status_pagamento_enum AS ENUM ('nao_pago', 'pago');
CREATE TYPE status_doacao_enum AS ENUM ('pendente', 'recebida');

-- =========================
-- TABELA 1: USUARIOS
-- =========================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    data_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABELA 2: EVENTOS
-- =========================
CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    nome_evento VARCHAR(150) NOT NULL,
    tipo_evento tipo_evento_enum NOT NULL,
    descricao TEXT,
    data_evento TIMESTAMP NOT NULL, -- Alterado para TIMESTAMP para pegar hora
    local_evento VARCHAR(200) NOT NULL,
    limite_vendas INT, -- Obrigatório apenas para lógica de negócio do Talharim
    data_criacao_evento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_evento status_evento_enum NOT NULL DEFAULT 'ativo'
);

-- =========================
-- TABELA 3: RESERVAS TALHARIM
-- =========================
CREATE TABLE reservas_talharim (
    id_reserva SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    quantidade INT NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL, -- Coluna ADICIONADA conforme modelo
    observacoes TEXT,
    status_reserva status_reserva_enum NOT NULL DEFAULT 'ativa',
    status_retirada status_retirada_enum NOT NULL DEFAULT 'nao_retirado',
    status_pagamento status_pagamento_enum NOT NULL DEFAULT 'nao_pago',
    codigo_reserva VARCHAR(50) UNIQUE NOT NULL,
    data_criacao_talharim TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Chaves Estrangeiras
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_reserva_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
);

-- =========================
-- TABELA 4: DOACOES BAZAR
-- =========================
CREATE TABLE doacoes_bazar (
    id_doacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    tipos_itens VARCHAR(50) NOT NULL, -- Alterado de JSON para VARCHAR conforme modelo
    quantidade INT NOT NULL,
    descricao TEXT NOT NULL,
    status_doacao status_doacao_enum NOT NULL DEFAULT 'pendente',
    codigo_doacao VARCHAR(50) UNIQUE NOT NULL,
    data_criacao_bazar TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Nome corrigido conforme modelo
    
    -- Chaves Estrangeiras
    CONSTRAINT fk_doacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_doacao_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
);

-- =========================
-- TABELA 5: USUARIO PAINEL ADM (ADICIONADA)
-- =========================
CREATE TABLE usuario_painel_adm (
    id_admin SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);