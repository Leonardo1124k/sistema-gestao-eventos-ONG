package com.sistema.reservas.dto;

import com.sistema.reservas.model.StatusEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoDTO {

    private Long idEvento;

    @NotBlank(message = "Nome do evento é obrigatório")
    private String nomeEvento;

    @NotNull(message = "Data/hora do evento é obrigatória")
    private LocalDateTime dataHoraEvento;

    private String local;

    private Integer limiteProdutos;

    private StatusEvento statusEvento;

    @NotNull(message = "ID do administrador é obrigatório")
    private Long idAdmin;

    private String nomeAdmin;
}
