package com.ongmoradiadigna.api.controller;

import com.ongmoradiadigna.api.dto.DoacaoDTO;
import com.ongmoradiadigna.api.dto.StatusUpdateDTO;
import com.ongmoradiadigna.api.model.DoacaoBazar;
import com.ongmoradiadigna.api.service.DoacaoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doacoes")
public class DoacaoController {

    @Autowired
    private DoacaoService doacaoService;

    @PostMapping
    public ResponseEntity<?> criarDoacao(@RequestBody DoacaoDTO doacaoDTO) {
        try {
            DoacaoBazar novaDoacao = doacaoService.criarDoacao(
                doacaoDTO.getIdUsuario(),
                doacaoDTO.getIdEvento(),
                doacaoDTO.getTiposItens(),
                doacaoDTO.getQuantidade(),
                doacaoDTO.getDescricao()
            );
            return new ResponseEntity<>(novaDoacao, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id_evento}")
    public ResponseEntity<List<DoacaoBazar>> getDoacoesPorEvento(@PathVariable Long id_evento) {
        List<DoacaoBazar> doacoes = doacaoService.getDoacoesPorEvento(id_evento);
        return ResponseEntity.ok(doacoes);
    }

    @PutMapping("/{id_doacao}/status")
    public ResponseEntity<?> updateStatusDoacao(@PathVariable Long id_doacao, @RequestBody StatusUpdateDTO dto) {
        try {
            DoacaoBazar doacao = doacaoService.atualizarStatusDoacao(id_doacao, dto.getStatus());
            return ResponseEntity.ok(doacao);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id_doacao}")
    public ResponseEntity<?> deletarDoacao(@PathVariable Long id_doacao) {
        try {
            doacaoService.deletarDoacao(id_doacao);
            // Retorna 204 No Content para indicar sucesso na exclusão
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            // Retorna 404 Not Found se a doação não existir
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Retorna 500 Internal Server Error para outros erros
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
