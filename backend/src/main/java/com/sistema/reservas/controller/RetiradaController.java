package com.sistema.reservas.controller;

import com.sistema.reservas.dto.RetiradaDTO;
import com.sistema.reservas.service.RetiradaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retiradas")
@RequiredArgsConstructor
public class RetiradaController {

    private final RetiradaService service;

    @PostMapping("/reserva/{idReserva}")
    public ResponseEntity<RetiradaDTO> registrar(@PathVariable Long idReserva) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(idReserva));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<RetiradaDTO> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(service.confirmarRetirada(id));
    }

    @GetMapping("/reserva/{idReserva}")
    public ResponseEntity<RetiradaDTO> buscarPorReserva(@PathVariable Long idReserva) {
        return ResponseEntity.ok(service.buscarPorReserva(idReserva));
    }
}
