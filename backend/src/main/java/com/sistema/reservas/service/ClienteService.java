package com.sistema.reservas.service;

import com.sistema.reservas.dto.ClienteDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Cliente;
import com.sistema.reservas.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    @Transactional
    public ClienteDTO cadastrar(ClienteDTO dto) {
        if (repository.existsByCpf(dto.getCpf())) {
            throw new BusinessException("CPF já cadastrado: " + dto.getCpf());
        }
        if (dto.getEmail() != null && repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + dto.getEmail());
        }
        Cliente cliente = Cliente.builder()
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .email(dto.getEmail())
                .cpf(dto.getCpf())
                .build();
        return toDTO(repository.save(cliente));
    }

    @Transactional
    public ClienteDTO atualizar(Long id, ClienteDTO dto) {
        Cliente cliente = buscarEntidade(id);
        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEmail(dto.getEmail());
        return toDTO(repository.save(cliente));
    }

    @Transactional(readOnly = true)
    public ClienteDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public ClienteDTO buscarPorCpf(String cpf) {
        Cliente cliente = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com CPF: " + cpf));
        return toDTO(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Cliente buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + id));
    }

    private ClienteDTO toDTO(Cliente c) {
        return ClienteDTO.builder()
                .idCliente(c.getIdCliente())
                .nome(c.getNome())
                .telefone(c.getTelefone())
                .email(c.getEmail())
                .cpf(c.getCpf())
                .build();
    }
}
