package com.sistema.reservas.dto;

import com.sistema.reservas.model.StatusDoacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoacaoBazarDTO {
    private Long idDoacao;

    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;

    private String nomeUsuario;
    private String emailUsuario;

    @NotNull(message = "ID do evento é obrigatório")
    private Long idEvento;

    private String nomeEvento;

    @NotBlank(message = "Tipos de itens é obrigatório")
    private String tiposItens;

    @Positive(message = "Quantidade deve ser positiva")
    @NotNull(message = "Quantidade é obrigatória")
    private Integer quantidade;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    private StatusDoacao statusDoacao;
    private String codigoDoacao;
    private LocalDateTime dataCriacaoBazar;
}
