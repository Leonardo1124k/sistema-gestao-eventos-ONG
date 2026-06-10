package com.sistema.reservas.service;

import com.sistema.reservas.dto.RetiradaDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Retirada;
import com.sistema.reservas.model.StatusRetirada;
import com.sistema.reservas.repository.RetiradaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RetiradaService {

    private final RetiradaRepository repository;
    // Atualizado o método confirmar (Blindado contra cliques duplos)
    @Transactional
    public RetiradaDTO confirmarRetirada(Long id) {
        Retirada retirada = buscarEntidade(id);
        
        if (retirada.getStatusRetirada() == StatusRetirada.retirado) {
            throw new BusinessException("Esta retirada já foi confirmada anteriormente.");
        }
        
        retirada.setStatusRetirada(StatusRetirada.retirado);
        retirada.setDataHoraRetirada(LocalDateTime.now()); // Registra o momento exato da entrega
        return toDTO(repository.save(retirada));
    }

    // NOVO MÉTODO: Para relatórios e listagens
    @Transactional(readOnly = true)
    public List<RetiradaDTO> listarPorStatus(StatusRetirada status) {
        return repository.findByStatusRetirada(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // NOVO MÉTODO: Para reverter uma entrega confirmada por engano
    @Transactional
    public RetiradaDTO reverterRetirada(Long id) {
        Retirada retirada = buscarEntidade(id);
        
        if (retirada.getStatusRetirada() == StatusRetirada.pendente) {
            throw new BusinessException("Esta retirada já está com o status pendente.");
        }
        
        retirada.setStatusRetirada(StatusRetirada.pendente);
        retirada.setDataHoraRetirada(null); // Limpa o registro de data da entrega incorreta
        return toDTO(repository.save(retirada));
    }

    @Transactional(readOnly = true)
    public RetiradaDTO buscarPorReserva(Long idReserva) {
        Retirada retirada = repository.findByReservaIdReserva(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Retirada não encontrada para reserva: " + idReserva));
        return toDTO(retirada);
    }

    private Retirada buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Retirada não encontrada: " + id));
    }

    private RetiradaDTO toDTO(Retirada r) {
        return RetiradaDTO.builder()
                .idRetirada(r.getIdRetirada())
                .statusRetirada(r.getStatusRetirada())
                .dataHoraRetirada(r.getDataHoraRetirada())
                .idReserva(r.getReserva().getIdReserva())
                .build();
    }
}
