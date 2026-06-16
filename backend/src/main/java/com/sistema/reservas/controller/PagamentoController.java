package com.sistema.reservas.controller;

import com.sistema.reservas.dto.PagamentoDTO;
import com.sistema.reservas.model.StatusPagamento;
import com.sistema.reservas.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://leonardo1124k.github.io")
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

    // O ENDPOINT DE LISTAR POR STATUS (Certifique-se de que ele está assim)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PagamentoDTO>> listarPorStatus(@PathVariable StatusPagamento status) {
        return ResponseEntity.ok(service.listarPorStatus(status));
    }

    // NOVO ENDPOINT: Reverter pagamento
    @PatchMapping("/{id}/reverter")
    public ResponseEntity<PagamentoDTO> reverter(@PathVariable Long id) {
        return ResponseEntity.ok(service.reverter(id));
    }
}
