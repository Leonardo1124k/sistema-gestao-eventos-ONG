package com.sistema.reservas.controller;

import com.sistema.reservas.dto.AdministradorDTO;
import com.sistema.reservas.dto.AuthDTO;
import com.sistema.reservas.model.Administrador;
import com.sistema.reservas.security.JwtService;
import com.sistema.reservas.service.AdministradorService;
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

    private final AdministradorService service;
    private final JwtService jwtService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AdministradorDTO> cadastrar(@Valid @RequestBody AdministradorDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthDTO dto) {
        Administrador admin = service.autenticar(dto);
        String token = jwtService.gerarToken(admin.getUsuario());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", admin.getUsuario(),
                "idAdmin", admin.getIdAdmin().toString()
        ));
    }
}
