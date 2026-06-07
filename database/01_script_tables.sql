-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS db_moradia_digna;
USE db_moradia_digna;


-- 1. Administrador
CREATE TABLE administrador (
    id_admin BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(260) NOT NULL
);


-- 2. Cliente
CREATE TABLE cliente (
    id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone CHAR(15), -- COLOCAR NOT NULL
    email VARCHAR(100) UNIQUE, --NOT NULL
    cpf CHAR(11) NOT NULL UNIQUE
);


-- 3. Evento
CREATE TABLE evento (
    id_evento BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_evento VARCHAR(100) NOT NULL,
    data_hora_evento DATETIME NOT NULL,
    local VARCHAR(250), -- NOT NULL
    limite_produtos INT, -- NOT NULL
    status_evento ENUM('planejamento', 'aberto', 'encerrado'), --NOT NULL
    fk_id_admin BIGINT NOT NULL,
    FOREIGN KEY (fk_id_admin) REFERENCES administrador(id_admin)
);


-- 4. Produto
CREATE TABLE produto (
    id_produto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    preco_produto DECIMAL(10,2) NOT NULL
);


-- 5. Reserva
CREATE TABLE reserva (
    id_reserva BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_confirmacao VARCHAR(20) NOT NULL UNIQUE,
    data_hora_reserva DATETIME NOT NULL,
    valor_reserva DECIMAL(10,2) NOT NULL,
    observacoes VARCHAR(500),
    fk_id_cliente BIGINT NOT NULL,
    fk_id_evento BIGINT NOT NULL,
    FOREIGN KEY (fk_id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (fk_id_evento) REFERENCES evento(id_evento)
);


-- 6. Pagamento
CREATE TABLE pagamento (
    id_pagamento BIGINT AUTO_INCREMENT PRIMARY KEY,
    forma_pagamento ENUM('pix', 'dinheiro', 'cartao') NOT NULL,
    status_pagamento ENUM('pendente', 'pago'), -- NOT NULL
    valor_pago DECIMAL(10,2) NOT NULL,
    fk_id_reserva BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (fk_id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE
);


-- 7. Retirada
CREATE TABLE retirada (
    id_retirada BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_retirada ENUM('pendente', 'retirado'), -- NOT NULL
    data_hora_retirada DATETIME, -- NOT NULL
    fk_id_reserva BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (fk_id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE
);

-- 8. Itens da Reserva (Tabela Associativa)
CREATE TABLE reserva_produto (
    id_reserva_produto BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_id_reserva BIGINT NOT NULL,
    fk_id_produto BIGINT NOT NULL,
    fk_id_cliente BIGINT NOT NULL, -- APAGAR ISSO (fk_id_reserva ja é suficiente pois na entidade reserva contem qual é o cliente.)
    quant_item INT NOT NULL, -- O CERTO É quant_produto (conforme DER's)
    valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (fk_id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE, --NA LINHA ABAIXO O CORRETO NÃO SERIA TER ON DELETE CASCADE TAMBÉM?
    FOREIGN KEY (fk_id_produto) REFERENCES produto(id_produto)
);
