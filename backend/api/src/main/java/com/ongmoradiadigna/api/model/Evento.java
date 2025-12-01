package com.ongmoradiadigna.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "eventos")
public class Evento implements Serializable {
    public enum TipoEvento { talharim, bazar }
    public enum StatusEvento { ativo, inativo }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id_evento;
    @Column(nullable = false, length = 150) private String nome_evento;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private TipoEvento tipo_evento;
    @Column(columnDefinition = "TEXT") private String descricao;
    @Column(nullable = false) private LocalDate data_evento;
    @Column(nullable = false, length = 200) private String local_evento;
    private Integer limite_vendas;
    @Column(nullable = false, updatable = false) private LocalDate data_criacao_evento;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private StatusEvento status_evento;

    @PrePersist
    protected void onCreate() {
        data_criacao_evento = LocalDate.now();
        if (status_evento == null) status_evento = StatusEvento.ativo;
    }
}
