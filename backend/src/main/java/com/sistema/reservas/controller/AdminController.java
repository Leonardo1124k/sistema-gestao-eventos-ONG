package com.sistema.reservas.controller;

import com.sistema.reservas.dto.UsuarioPainelAdmDTO;
import com.sistema.reservas.dto.AuthDTO;
import com.sistema.reservas.model.UsuarioPainelAdm;
import com.sistema.reservas.security.JwtService;
import com.sistema.reservas.service.UsuarioPainelAdmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioPainelAdmService service;
    private final JwtService jwtService;

    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioPainelAdmDTO> cadastrar(@Valid @RequestBody UsuarioPainelAdmDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthDTO dto) {
        UsuarioPainelAdm admin = service.autenticar(dto);
        String token = jwtService.gerarToken(admin.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", admin.getEmail(),
                "idAdmin", admin.getIdAdmin().toString()
        ));
    }
}
