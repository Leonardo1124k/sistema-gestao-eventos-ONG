package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "doacoes_bazar")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoacaoBazar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doacao")
    private Long idDoacao;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @NotBlank(message = "Tipos de itens é obrigatório")
    @Column(name = "tipos_itens", nullable = false, length = 50)
    private String tiposItens;

    @Positive(message = "Quantidade deve ser positiva")
    @Column(nullable = false)
    private Integer quantidade;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_doacao", nullable = false)
    @Builder.Default
    private StatusDoacao statusDoacao = StatusDoacao.pendente;

    @Column(name = "codigo_doacao", unique = true, nullable = false, length = 50)
    private String codigoDoacao;

    @Column(name = "data_criacao_bazar", nullable = false, updatable = false)
    private LocalDateTime dataCriacaoBazar;

    @PrePersist
    public void prePersist() {
        if (this.codigoDoacao == null) {
            this.codigoDoacao = "DOA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.dataCriacaoBazar == null) {
            this.dataCriacaoBazar = LocalDateTime.now();
        }
    }

    public void receberDoacao() {
        this.statusDoacao = StatusDoacao.recebida;
    }
}
