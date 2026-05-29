package com.sistema.reservas.controller;

import com.sistema.reservas.dto.EventoDTO;
import com.sistema.reservas.model.StatusEvento;
import com.sistema.reservas.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService service;

    @PostMapping
    public ResponseEntity<EventoDTO> criar(@Valid @RequestBody EventoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> editar(@PathVariable Long id, @Valid @RequestBody EventoDTO dto) {
        return ResponseEntity.ok(service.editar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventoDTO> atualizarStatus(@PathVariable Long id,
                                                      @RequestParam StatusEvento status) {
        return ResponseEntity.ok(service.atualizarStatus(id, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/abertos")
    public ResponseEntity<List<EventoDTO>> listarAbertos() {
        return ResponseEntity.ok(service.listarAbertos());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EventoDTO>> listarPorStatus(@PathVariable StatusEvento status) {
        return ResponseEntity.ok(service.listarPorStatus(status));
    }
}
