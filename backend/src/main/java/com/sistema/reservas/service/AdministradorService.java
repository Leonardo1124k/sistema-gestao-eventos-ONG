package com.sistema.reservas.service;

import com.sistema.reservas.dto.AdministradorDTO;
import com.sistema.reservas.dto.AuthDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Administrador;
import com.sistema.reservas.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final AdministradorRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AdministradorDTO cadastrar(AdministradorDTO dto) {
        if (repository.existsByUsuario(dto.getUsuario())) {
            throw new BusinessException("Usuário já cadastrado: " + dto.getUsuario());
        }
        Administrador admin = Administrador.builder()
                .usuario(dto.getUsuario())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .build();
        Administrador saved = repository.save(admin);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public Administrador autenticar(AuthDTO dto) {
        Administrador admin = repository.findByUsuario(dto.getUsuario())
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));
        if (!passwordEncoder.matches(dto.getSenha(), admin.getSenha())) {
            throw new BusinessException("Credenciais inválidas");
        }
        return admin;
    }

    @Transactional(readOnly = true)
    public Administrador buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado: " + id));
    }

    private AdministradorDTO toDTO(Administrador admin) {
        return AdministradorDTO.builder()
                .idAdmin(admin.getIdAdmin())
                .usuario(admin.getUsuario())
                .build();
    }
}
