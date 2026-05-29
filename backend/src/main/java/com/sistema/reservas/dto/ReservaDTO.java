package com.sistema.reservas.dto;

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

    @NotNull(message = "Valor da reserva é obrigatório")
    private BigDecimal valorReserva;

    private String observacoes;

    @NotNull(message = "ID do cliente é obrigatório")
    private Long idCliente;

    private String nomeCliente;
    private String cpfCliente;

    @NotNull(message = "ID do evento é obrigatório")
    private Long idEvento;

    private String nomeEvento;

    private List<ReservaProdutoDTO> itens;

    private PagamentoDTO pagamento;
    private RetiradaDTO retirada;
}
