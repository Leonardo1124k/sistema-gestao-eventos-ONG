package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long idEvento;

    @NotBlank(message = "Nome do evento é obrigatório")
    @Column(name = "nome_evento", nullable = false, length = 100)
    private String nomeEvento;

    @NotNull(message = "Data/hora do evento é obrigatória")
    @Column(name = "data_hora_evento", nullable = false)
    private LocalDateTime dataHoraEvento;

    @Column(name = "local", length = 250)
    private String local; //aqui

    @Column(name = "limite_produtos")
    private Integer limiteProdutos; //aqui

    @Enumerated(EnumType.STRING)
    @Column(name = "status_evento")
    @Builder.Default
    private StatusEvento statusEvento = StatusEvento.planejamento; //AQUI

    @NotNull(message = "Administrador é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_admin", nullable = false)
    private Administrador administrador;
}
