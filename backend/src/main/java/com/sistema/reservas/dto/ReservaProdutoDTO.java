package com.sistema.reservas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaProdutoDTO {

    private Long idReservaProduto;

    @NotNull(message = "ID do produto é obrigatório")
    private Long idProduto;

    private String nomeProduto;

    // apagado private Long idCliente;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private Integer quantProduto;

    //se tornou desnecessario @NotNull(message = "Valor é obrigatório")
    private BigDecimal valor;
}
