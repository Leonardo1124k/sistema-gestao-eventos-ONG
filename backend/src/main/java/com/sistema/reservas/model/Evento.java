package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
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
    @Column(name = "nome_evento", nullable = false, length = 150)
    private String nomeEvento;

    @NotNull(message = "Tipo do evento é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false)
    private TipoEvento tipoEvento;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "Data do evento é obrigatória")
    @Column(name = "data_evento", nullable = false)
    private LocalDateTime dataEvento;

    @NotBlank(message = "Local do evento é obrigatório")
    @Column(name = "local_evento", nullable = false, length = 200)
    private String localEvento;

    @Column(name = "limite_vendas")
    private Integer limiteVendas;

    @Column(name = "data_criacao_evento", nullable = false, updatable = false)
    private LocalDateTime dataCriacaoEvento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_evento", nullable = false)
    @Builder.Default
    private StatusEvento statusEvento = StatusEvento.ativo;

    @PrePersist
    public void prePersist() {
        if (this.dataCriacaoEvento == null) {
            this.dataCriacaoEvento = LocalDateTime.now();
        }
    }

    public void ativar() {
        this.statusEvento = StatusEvento.ativo;
    }

    public void desativar() {
        this.statusEvento = StatusEvento.inativo;
    }
}
