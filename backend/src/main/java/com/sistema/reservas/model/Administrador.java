package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private Long idAdmin;

    @NotBlank(message = "Usuário é obrigatório")
    @Column(name = "usuario", nullable = false, unique = true, length = 50)
    private String usuario;

    @NotBlank(message = "Senha é obrigatória")
    @Column(name = "senha", nullable = false, length = 260)
    private String senha;
}
