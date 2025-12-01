package com.ongmoradiadigna.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "reservas_talharim")
public class ReservaTalharim implements Serializable {
    public enum StatusReserva { ativa, cancelada }
    public enum StatusRetirada { nao_retirado, retirado }
    public enum StatusPagamento { nao_pago, pago }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id_reserva;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_usuario", nullable = false) private Usuario usuario;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_evento", nullable = false) private Evento evento;
    @Column(nullable = false) private Integer quantidade;
    @Column(columnDefinition = "TEXT") private String observacoes;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private StatusReserva status_reserva;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private StatusRetirada status_retirada;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private StatusPagamento status_pagamento;
    @Column(unique = true, nullable = false, length = 50) private String codigo_reserva;
    @Column(nullable = false, updatable = false) private LocalDate data_criacao_talharim;

    @PrePersist
    protected void onCreate() {
        data_criacao_talharim = LocalDate.now();
        if (status_reserva == null) status_reserva = StatusReserva.ativa;
        if (status_retirada == null) status_retirada = StatusRetirada.nao_retirado;
        if (status_pagamento == null) status_pagamento = StatusPagamento.nao_pago;
    }
}
