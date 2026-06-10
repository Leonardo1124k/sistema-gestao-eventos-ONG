-- Administradores
INSERT INTO administrador (usuario, senha) VALUES 
('luciano_ads', 'fatec2026'), ('felipe_ads', 'fatec2026'), ('admin_ong', 'ong123');

-- 10 Clientes Variados
INSERT INTO cliente (nome, telefone, email, cpf) VALUES 
('Luciano Peixoto', '16991234567', 'luciano@email.com', '11122233344'),
('Ana Beatriz', '16998765432', 'ana@email.com', '22233344455'),
('Carlos Lima', '16992223333', 'carlos@email.com', '33344455566'),
('Mariana Oliveira', '16994445555', 'mari@email.com', '44455566677'),
('Roberto Almeida', '16981112222', 'roberto@email.com', '55566677788'),
('Juliana Costa', '16988889999', 'ju@email.com', '66677788899'),
('Fernanda Souza', '16991110001', 'fernanda@email.com', '77788899900'),
('Ricardo Pereira', '16991110002', 'ricardo@email.com', '88899900011'),
('Camila Rodrigues', '16991110003', 'camila@email.com', '99900011122'),
('Gustavo Henrique', '16991110004', 'gustavo@email.com', '00011122233');

-- Produtos com preços diferentes
INSERT INTO produto (nome_produto, preco_produto) VALUES 
('Talharim Bolonhesa', 18.00), ('Talharim 4 Queijos', 20.00), 
('Refrigerante', 6.00), ('Agua Mineral', 4.00), 
('Cachorro Quente', 12.00), ('Pastel de Carne', 10.00), 
('Espetinho', 15.00);

-- 3 Eventos em estados diferentes
INSERT INTO evento (nome_evento, data_hora_evento, local, limite_produtos, status_evento, fk_id_admin) VALUES 
('Festival do Talharim', '2026-03-10 19:00:00', 'Jd. Aeroporto', 500, 'encerrado', 1),
('Festa Junina', '2026-06-15 18:00:00', 'Sede ONG', 1000, 'aberto', 1),
('Almoco Primavera', '2026-09-20 12:00:00', 'Centro Voluntarios', 300, 'planejamento', 2);

-- 10 Reservas (Distribuídas: 3 no Evento 1, 4 no Evento 2, 3 no Evento 3)
INSERT INTO reserva (id_reserva, codigo_confirmacao, data_hora_reserva, valor_reserva, fk_id_cliente, fk_id_evento) VALUES 
(1, 'TAL01', NOW(), 18.00, 1, 1), (2, 'TAL02', NOW(), 24.00, 2, 1), (3, 'TAL03', NOW(), 20.00, 3, 1),
(4, 'JUN04', NOW(), 12.00, 4, 2), (5, 'JUN05', NOW(), 22.00, 5, 2), (6, 'JUN06', NOW(), 10.00, 6, 2), (7, 'JUN07', NOW(), 15.00, 7, 2),
(8, 'PRI08', NOW(), 20.00, 8, 3), (9, 'PRI09', NOW(), 4.00, 9, 3), (10, 'PRI10', NOW(), 38.00, 10, 3);

-- Itens das Reservas (Quem comprou o quê)
INSERT INTO reserva_produto (fk_id_reserva, fk_id_produto, quant_produto, valor) VALUES 
(1, 1, 1, 18.00), -- Reserva 1: 1 Talharim Bolonhesa
(2, 1, 1, 18.00), (2, 3, 1, 6.00), -- Reserva 2: Macarrão + Refri
(3, 2, 1, 20.00), -- Reserva 3: 1 Talharim 4 Queijos
(4, 5, 1, 12.00), -- Reserva 4: 1 Hot Dog
(5, 5, 1, 12.00), (5, 6, 1, 10.00), -- Reserva 5: Hot Dog + Pastel
(6, 6, 1, 10.00), -- Reserva 6: 1 Pastel
(7, 7, 1, 15.00), -- Reserva 7: 1 Espetinho
(8, 2, 1, 20.00), -- Reserva 8: 1 Talharim 4 Queijos
(9, 4, 1, 4.00),  -- Reserva 9: 1 Água
(10, 1, 1, 18.00), (10, 2, 1, 20.00); -- Reserva 10: 2 Macarrões

-- Pagamentos
INSERT INTO pagamento (forma_pagamento, status_pagamento, valor_pago, fk_id_reserva) VALUES 
('pix', 'pago', 18.00, 1), ('dinheiro', 'pago', 24.00, 2), ('cartao', 'pago', 20.00, 3),
('pix', 'pendente', 0.00, 4), ('pix', 'pago', 22.00, 5), ('dinheiro', 'pago', 10.00, 6),
('cartao', 'pendente', 0.00, 7), ('pix', 'pago', 20.00, 8), ('dinheiro', 'pago', 4.00, 9),
('pix', 'pago', 38.00, 10);

-- Retiradas
INSERT INTO retirada (status_retirada, data_hora_retirada, fk_id_reserva) VALUES 
('retirado', NOW(), 1), ('retirado', NOW(), 2), ('pendente', NOW(), 3), 
('pendente', NOW(),  4), ('retirado', NOW(), 5), ('retirado',NOW(), 6), 
('pendente',NOW(), 7), ('retirado',NOW(), 8), ('pendente',NOW(), 9), ('pendente',NOW(), 10);