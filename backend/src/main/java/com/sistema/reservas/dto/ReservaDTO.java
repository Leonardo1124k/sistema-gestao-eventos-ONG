package com.sistema.reservas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {

    private Long idReserva;
    private String codigoConfirmacao;
    private LocalDateTime dataHoraReserva;

    //se tornou desnecessario @NotNull(message = "Valor da reserva é obrigatório")
    private BigDecimal valorReserva;

    private String observacoes;

    @NotNull(message = "ID do cliente é obrigatório")
    private Long idCliente;

    private String nomeCliente;
    private String cpfCliente;

    @NotNull(message = "ID do evento é obrigatório")
    private Long idEvento;

    private String nomeEvento;

    @NotEmpty(message = "A reserva deve conter pelo menos um produto.")
    @Valid // Garante que as regras do ReservaProdutoDTO sejam validadas
    private List<ReservaProdutoDTO> itens;

    private PagamentoDTO pagamento;
    private RetiradaDTO retirada;
}
