package com.ongmoradiadigna.api.controller;

import com.ongmoradiadigna.api.dto.ReservaDTO;
import com.ongmoradiadigna.api.dto.StatusUpdateDTO;
import com.ongmoradiadigna.api.model.ReservaTalharim;
import com.ongmoradiadigna.api.service.ReservaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public ResponseEntity<?> criarReserva(@RequestBody ReservaDTO reservaDTO) {
        try {
            ReservaTalharim novaReserva = reservaService.criarReserva(
                reservaDTO.getIdUsuario(),
                reservaDTO.getIdEvento(),
                reservaDTO.getQuantidade(),
                reservaDTO.getObservacoes()
            );
            return new ResponseEntity<>(novaReserva, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id_evento}")
    public ResponseEntity<List<ReservaTalharim>> getReservasPorEvento(@PathVariable Long id_evento) {
        List<ReservaTalharim> reservas = reservaService.getReservasPorEvento(id_evento);
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/{id_reserva}/status_retirada")
    public ResponseEntity<?> updateStatusRetirada(@PathVariable Long id_reserva, @RequestBody StatusUpdateDTO dto) {
        try {
            ReservaTalharim reserva = reservaService.atualizarStatusRetirada(id_reserva, dto.getStatus());
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id_reserva}/status_pagamento")
    public ResponseEntity<?> updateStatusPagamento(@PathVariable Long id_reserva, @RequestBody StatusUpdateDTO dto) {
        try {
            ReservaTalharim reserva = reservaService.atualizarStatusPagamento(id_reserva, dto.getStatus());
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id_reserva}/status_reserva")
    public ResponseEntity<?> updateStatusReserva(@PathVariable Long id_reserva, @RequestBody StatusUpdateDTO dto) {
        try {
            ReservaTalharim reserva = reservaService.atualizarStatusReserva(id_reserva, dto.getStatus());
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/{id_reserva}")
    public ResponseEntity<?> deletarReserva(@PathVariable Long id_reserva) {
        try {
            reservaService.deletarReserva(id_reserva);
            // Retorna 204 No Content para indicar sucesso na exclusão
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            // Retorna 404 Not Found se a reserva não existir
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Retorna 500 Internal Server Error para outros erros
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
