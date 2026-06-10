package com.sistema.reservas.dto;

import com.sistema.reservas.model.FormaPagamento;
import com.sistema.reservas.model.StatusPagamento;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagamentoDTO {

    private Long idPagamento;

    @NotNull(message = "Forma de pagamento é obrigatória")
    private FormaPagamento formaPagamento;

    private StatusPagamento statusPagamento;

    //e necessario que o valor pago seja puxado do valor da reserva... @NotNull(message = "Valor pago é obrigatório")
    private BigDecimal valorPago;

    private Long idReserva;
}
