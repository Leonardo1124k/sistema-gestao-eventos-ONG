package com.sistema.reservas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.sistema.reservas.model.FormaPagamento;

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
    private String emailCliente;
    private String telefoneCliente;

    @NotNull(message = "ID do evento é obrigatório")
    private Long idEvento;

    private String nomeEvento;

    @NotEmpty(message = "A reserva deve conter pelo menos um produto.")
    @Valid // Garante que as regras do ReservaProdutoDTO sejam validadas
    private List<ReservaProdutoDTO> itens;

    private PagamentoDTO pagamento;
    private RetiradaDTO retirada;

    // Adicione este campo no seu ReservaDTO pois FormaPagamento é preenchido no formulario frontend.
    @NotNull(message = "A forma de pagamento é obrigatória")
    private FormaPagamento formaPagamento;
}
