package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservas_talharim")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaTalharim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long idReserva;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @Positive(message = "Quantidade deve ser positiva")
    @Column(nullable = false)
    private Integer quantidade;

    @NotBlank(message = "Forma de pagamento é obrigatória")
    @Column(name = "forma_pagamento", nullable = false, length = 50)
    private String formaPagamento;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_reserva", nullable = false)
    @Builder.Default
    private StatusReserva statusReserva = StatusReserva.ativa;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_retirada", nullable = false)
    @Builder.Default
    private StatusRetirada statusRetirada = StatusRetirada.nao_retirado;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", nullable = false)
    @Builder.Default
    private StatusPagamento statusPagamento = StatusPagamento.nao_pago;

    @Column(name = "codigo_reserva", unique = true, nullable = false, length = 50)
    private String codigoReserva;

    @Column(name = "data_criacao_talharim", nullable = false, updatable = false)
    private LocalDateTime dataCriacaoTalharim;

    @PrePersist
    public void prePersist() {
        if (this.codigoReserva == null) {
            this.codigoReserva = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.dataCriacaoTalharim == null) {
            this.dataCriacaoTalharim = LocalDateTime.now();
        }
    }

    public void cancelar() {
        this.statusReserva = StatusReserva.cancelada;
    }

    public void registrarPagamento() {
        this.statusPagamento = StatusPagamento.pago;
    }

    public void registrarRetirada() {
        this.statusRetirada = StatusRetirada.retirado;
    }
}
