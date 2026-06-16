package com.sistema.reservas.controller;

import com.sistema.reservas.dto.RetiradaDTO;
import com.sistema.reservas.model.StatusRetirada;
import com.sistema.reservas.service.RetiradaService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retiradas")
@RequiredArgsConstructor
public class RetiradaController {

    private final RetiradaService service;

    // O MÉTODO POST FOI REMOVIDO DAQUI

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<RetiradaDTO> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(service.confirmarRetirada(id));
    }

    @GetMapping("/reserva/{idReserva}")
    public ResponseEntity<RetiradaDTO> buscarPorReserva(@PathVariable Long idReserva) {
        return ResponseEntity.ok(service.buscarPorReserva(idReserva));
    }

    // NOVO ENDPOINT: Listar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RetiradaDTO>> listarPorStatus(@PathVariable StatusRetirada status) {
        return ResponseEntity.ok(service.listarPorStatus(status));
    }

    // NOVO ENDPOINT: Reverter a retirada
    @PatchMapping("/{id}/reverter")
    public ResponseEntity<RetiradaDTO> reverter(@PathVariable Long id) {
        return ResponseEntity.ok(service.reverterRetirada(id));
    }
}