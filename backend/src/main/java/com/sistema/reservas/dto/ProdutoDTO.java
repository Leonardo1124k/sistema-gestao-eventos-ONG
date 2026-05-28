package com.sistema.reservas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoDTO {

    private Long idProduto;

    @NotBlank(message = "Nome do produto é obrigatório")
    private String nomeProduto;

    @NotNull(message = "Preço é obrigatório")
    private BigDecimal precoProduto;
}
