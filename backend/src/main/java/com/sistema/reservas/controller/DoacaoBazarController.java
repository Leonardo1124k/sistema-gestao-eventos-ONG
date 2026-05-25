package com.sistema.reservas.controller;

import com.sistema.reservas.dto.DoacaoBazarDTO;
import com.sistema.reservas.service.DoacaoBazarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doacoes-bazar")
@RequiredArgsConstructor
public class DoacaoBazarController {

    private final DoacaoBazarService service;

    @PostMapping
    public ResponseEntity<DoacaoBazarDTO> criar(@Valid @RequestBody DoacaoBazarDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}/receber")
    public ResponseEntity<Void> receberDoacao(@PathVariable Long id) {
        service.receberDoacao(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoBazarDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<DoacaoBazarDTO> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(service.buscarPorCodigo(codigo));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<DoacaoBazarDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(service.listarPorUsuario(idUsuario));
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<DoacaoBazarDTO>> listarPorEvento(@PathVariable Long idEvento) {
        return ResponseEntity.ok(service.listarPorEvento(idEvento));
    }
}
