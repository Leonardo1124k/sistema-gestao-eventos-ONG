package com.sistema.reservas.dto;

import com.sistema.reservas.model.StatusEvento;
import com.sistema.reservas.model.TipoEvento;
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

    @NotNull(message = "Tipo do evento é obrigatório")
    private TipoEvento tipoEvento;

    private String descricao;

    @NotNull(message = "Data do evento é obrigatória")
    private LocalDateTime dataEvento;

    @NotBlank(message = "Local do evento é obrigatório")
    private String localEvento;

    private Integer limiteVendas;

    private LocalDateTime dataCriacaoEvento;

    private StatusEvento statusEvento;
}
