package com.ongmoradiadigna.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id_usuario;
    @Column(nullable = false, length = 150) private String nome;
    @Column(nullable = false, unique = true, length = 150) private String email;
    @Column(nullable = false, length = 20) private String telefone;
    @Column(nullable = false, updatable = false) private LocalDate data_registro;
    @PrePersist protected void onCreate() { data_registro = LocalDate.now(); }
}
