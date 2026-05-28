package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Long idProduto;

    @NotBlank(message = "Nome do produto é obrigatório")
    @Column(name = "nome_produto", nullable = false, length = 100)
    private String nomeProduto;

    @NotNull(message = "Preço é obrigatório")
    @Column(name = "preco_produto", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoProduto;
}
