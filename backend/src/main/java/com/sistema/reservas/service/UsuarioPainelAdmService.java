package com.sistema.reservas.service;

import com.sistema.reservas.dto.UsuarioPainelAdmDTO;
import com.sistema.reservas.dto.AuthDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.UsuarioPainelAdm;
import com.sistema.reservas.repository.UsuarioPainelAdmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioPainelAdmService {

    private final UsuarioPainelAdmRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioPainelAdmDTO cadastrar(UsuarioPainelAdmDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + dto.getEmail());
        }
        UsuarioPainelAdm admin = UsuarioPainelAdm.builder()
                .email(dto.getEmail())
                .senhaHash(passwordEncoder.encode(dto.getSenha()))
                .build();
        UsuarioPainelAdm saved = repository.save(admin);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public UsuarioPainelAdm autenticar(AuthDTO dto) {
        UsuarioPainelAdm admin = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));
        if (!passwordEncoder.matches(dto.getSenha(), admin.getSenhaHash())) {
            throw new BusinessException("Credenciais inválidas");
        }
        return admin;
    }

    @Transactional(readOnly = true)
    public UsuarioPainelAdm buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado: " + id));
    }

    private UsuarioPainelAdmDTO toDTO(UsuarioPainelAdm admin) {
        return UsuarioPainelAdmDTO.builder()
                .idAdmin(admin.getIdAdmin())
                .email(admin.getEmail())
                .dataCriacao(admin.getDataCriacao())
                .build();
    }
}
