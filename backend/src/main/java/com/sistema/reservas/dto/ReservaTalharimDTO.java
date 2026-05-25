package com.sistema.reservas.dto;

import com.sistema.reservas.model.StatusPagamento;
import com.sistema.reservas.model.StatusReserva;
import com.sistema.reservas.model.StatusRetirada;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaTalharimDTO {
    private Long idReserva;

    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;

    private String nomeUsuario;
    private String emailUsuario;

    @NotNull(message = "ID do evento é obrigatório")
    private Long idEvento;

    private String nomeEvento;

    @Positive(message = "Quantidade deve ser positiva")
    @NotNull(message = "Quantidade é obrigatória")
    private Integer quantidade;

    @NotNull(message = "Forma de pagamento é obrigatória")
    private String formaPagamento;

    private String observacoes;

    private StatusReserva statusReserva;
    private StatusRetirada statusRetirada;
    private StatusPagamento statusPagamento;

    private String codigoReserva;
    private LocalDateTime dataCriacaoTalharim;
}
