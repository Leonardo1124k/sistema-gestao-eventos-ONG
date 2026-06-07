package com.sistema.reservas.service;

import com.sistema.reservas.dto.RetiradaDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Reserva;
import com.sistema.reservas.model.Retirada;
import com.sistema.reservas.model.StatusRetirada;
import com.sistema.reservas.repository.RetiradaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RetiradaService {

    private final RetiradaRepository repository;
    private final ReservaService reservaService;

    @Transactional
    public RetiradaDTO registrar(Long idReserva) {
        Reserva reserva = reservaService.buscarEntidade(idReserva);
        if (repository.findByReservaIdReserva(idReserva).isPresent()) {
            throw new BusinessException("Já existe uma retirada para esta reserva.");
        }
        Retirada retirada = Retirada.builder()
                .statusRetirada(StatusRetirada.pendente)
                .dataHoraRetirada(LocalDateTime.now())
                .reserva(reserva)
                .build();
        return toDTO(repository.save(retirada));
    }

    @Transactional
    public RetiradaDTO confirmarRetirada(Long id) {
        Retirada retirada = buscarEntidade(id);
        retirada.setStatusRetirada(StatusRetirada.retirado);
        retirada.setDataHoraRetirada(LocalDateTime.now());
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
