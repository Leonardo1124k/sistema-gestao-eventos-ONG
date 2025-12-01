package com.ongmoradiadigna.api.dto;

import lombok.Data;

@Data
public class ReservaDTO {
    private Long idUsuario;
    private Long idEvento;
    private Integer quantidade;
    private String observacoes;
}
