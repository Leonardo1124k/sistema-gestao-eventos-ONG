-- =============================================================
-- POPULANDO O BANCO DE DADOS (DADOS DE TESTE)
-- =============================================================

-- 1. Inserir Administrador
INSERT INTO usuario_painel_adm (email, senha_hash) 
VALUES ('admin@moradiadigna.org', 'senha_criptografada_exemplo_123');

-- 2. Inserir Usuários (Participantes/Doadores)
INSERT INTO usuarios (nome, email, telefone) VALUES 
('Ana Silva', 'ana.silva@exemplo.com', '(16) 99111-1111'),
('Carlos Souza', 'carlos.souza@exemplo.com', '(16) 99222-2222');

-- 3. Inserir Eventos
-- Evento 1: Jantar (Talharim)
INSERT INTO eventos (nome_evento, tipo_evento, descricao, data_evento, local_evento, limite_vendas, status_evento) 
VALUES ('10º Talharim Beneficente', 'talharim', 'Delicioso jantar de massas para arrecadação de fundos.', '2025-12-10 19:30:00', 'Salão Paroquial do Centro', 300, 'ativo');

-- Evento 2: Bazar
INSERT INTO eventos (nome_evento, tipo_evento, descricao, data_evento, local_evento, status_evento) 
VALUES ('Grande Bazar de Natal', 'bazar', 'Venda de roupas e sapatos usados em bom estado.', '2025-12-15 08:00:00', 'Sede da ONG Moradia Digna', 'ativo');

-- 4. Inserir uma Reserva de Talharim (Usuario Ana Silva -> Evento Talharim)
-- Nota: Assumindo que Ana é id_usuario=1 e o Talharim é id_evento=1
INSERT INTO reservas_talharim (id_usuario, id_evento, quantidade, forma_pagamento, observacoes, status_reserva, status_pagamento, codigo_reserva) 
VALUES (1, 1, 2, 'PIX', 'Uma opção vegetariana se possível', 'ativa', 'pago', 'TLR-2025-001');

-- 5. Inserir uma Doação para o Bazar (Usuario Carlos Souza -> Evento Bazar)
-- Nota: Assumindo que Carlos é id_usuario=2 e o Bazar é id_evento=2
INSERT INTO doacoes_bazar (id_usuario, id_evento, tipos_itens, quantidade, descricao, status_doacao, codigo_doacao) 
VALUES (2, 2, 'Roupas', 15, 'Camisas sociais e calças jeans masculinas', 'pendente', 'BZR-2025-001');