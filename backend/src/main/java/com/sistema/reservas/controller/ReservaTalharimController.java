package com.sistema.reservas.controller;

import com.sistema.reservas.dto.ReservaTalharimDTO;
import com.sistema.reservas.service.ReservaTalharimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas-talharim")
@RequiredArgsConstructor
public class ReservaTalharimController {

    private final ReservaTalharimService service;

    @PostMapping
    public ResponseEntity<ReservaTalharimDTO> criar(@Valid @RequestBody ReservaTalharimDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        service.cancelar(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/pagamento")
    public ResponseEntity<Void> registrarPagamento(@PathVariable Long id) {
        service.registrarPagamento(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/retirada")
    public ResponseEntity<Void> registrarRetirada(@PathVariable Long id) {
        service.registrarRetirada(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaTalharimDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ReservaTalharimDTO> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(service.buscarPorCodigo(codigo));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ReservaTalharimDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(service.listarPorUsuario(idUsuario));
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<ReservaTalharimDTO>> listarPorEvento(@PathVariable Long idEvento) {
        return ResponseEntity.ok(service.listarPorEvento(idEvento));
    }
}
