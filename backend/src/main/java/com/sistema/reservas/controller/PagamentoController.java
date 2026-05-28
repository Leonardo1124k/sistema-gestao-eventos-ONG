package com.sistema.reservas.controller;

import com.sistema.reservas.dto.PagamentoDTO;
import com.sistema.reservas.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
public class PagamentoController {

    private final PagamentoService service;

    @PostMapping
    public ResponseEntity<PagamentoDTO> registrar(@Valid @RequestBody PagamentoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(dto));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<PagamentoDTO> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(service.confirmar(id));
    }

    @GetMapping("/reserva/{idReserva}")
    public ResponseEntity<PagamentoDTO> buscarPorReserva(@PathVariable Long idReserva) {
        return ResponseEntity.ok(service.buscarPorReserva(idReserva));
    }
}
