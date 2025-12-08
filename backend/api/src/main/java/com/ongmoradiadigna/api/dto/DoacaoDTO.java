package com.ongmoradiadigna.api.dto;

import lombok.Data;

@Data
public class DoacaoDTO {
    private Long idUsuario;
    private Long idEvento;
    private String tiposItens; // Enviado como uma String JSON: "{\"item\":\"roupa\",\"quantidade\":10}"
    private Integer quantidade;
    private String descricao;
}
