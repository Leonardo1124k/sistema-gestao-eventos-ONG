package com.sistema.reservas.controller;

import com.sistema.reservas.dto.EventoDTO;
import com.sistema.reservas.model.TipoEvento;
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

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable Long id) {
        service.ativar(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<EventoDTO>> listarAtivos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<EventoDTO>> listarPorTipo(@PathVariable TipoEvento tipo) {
        return ResponseEntity.ok(service.listarPorTipo(tipo));
    }
}
