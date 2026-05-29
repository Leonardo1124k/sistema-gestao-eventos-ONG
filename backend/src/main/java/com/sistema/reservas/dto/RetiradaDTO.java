package com.sistema.reservas.dto;

import com.sistema.reservas.model.StatusRetirada;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetiradaDTO {

    private Long idRetirada;
    private StatusRetirada statusRetirada;
    private LocalDateTime dataHoraRetirada;
    private Long idReserva;
}
