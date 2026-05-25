package com.sistema.reservas.service;

import com.sistema.reservas.dto.UsuarioDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Usuario;
import com.sistema.reservas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    @Transactional
    public UsuarioDTO criar(UsuarioDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + dto.getEmail());
        }
        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .telefone(dto.getTelefone())
                .build();
        Usuario saved = repository.save(usuario);
        return toDTO(saved);
    }

    @Transactional
    public UsuarioDTO atualizar(Long id, UsuarioDTO dto) {
        Usuario usuario = buscarEntidade(id);
        if (!usuario.getEmail().equalsIgnoreCase(dto.getEmail()) && repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + dto.getEmail());
        }
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        return toDTO(repository.save(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));
        return toDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = buscarEntidade(id);
        repository.delete(usuario);
    }

    public Usuario buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + id));
    }

    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder()
                .idUsuario(u.getIdUsuario())
                .nome(u.getNome())
                .email(u.getEmail())
                .telefone(u.getTelefone())
                .dataRegistro(u.getDataRegistro())
                .build();
    }
}
