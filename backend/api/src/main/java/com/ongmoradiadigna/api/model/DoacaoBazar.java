package com.ongmoradiadigna.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "doacoes_bazar")
public class DoacaoBazar implements Serializable {
    public enum StatusDoacao { pendente, recebida }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id_doacao;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_usuario", nullable = false) private Usuario usuario;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_evento", nullable = false) private Evento evento;
    @Column(columnDefinition = "JSON", nullable = false) private String tipos_itens;
    @Column(nullable = false) private Integer quantidade;
    @Column(columnDefinition = "TEXT", nullable = false) private String descricao;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private StatusDoacao status_doacao;
    @Column(unique = true, nullable = false, length = 50) private String codigo_doacao;
    @Column(nullable = false, updatable = false) private LocalDateTime criado_em;
    private LocalDate data_atualizacao;

    @PrePersist
    protected void onCreate() {
        criado_em = LocalDateTime.now();
        if (status_doacao == null) status_doacao = StatusDoacao.pendente;
    }
}
