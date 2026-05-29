package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "retirada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Retirada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_retirada")
    private Long idRetirada;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_retirada")
    @Builder.Default
    private StatusRetirada statusRetirada = StatusRetirada.pendente;

    @Column(name = "data_hora_retirada")
    private LocalDateTime dataHoraRetirada;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_reserva", nullable = false, unique = true)
    private Reserva reserva;
}
