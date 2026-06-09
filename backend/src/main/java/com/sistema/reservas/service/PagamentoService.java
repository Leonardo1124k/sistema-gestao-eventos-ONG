package com.sistema.reservas.service;

import com.sistema.reservas.dto.PagamentoDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Pagamento;
import com.sistema.reservas.model.Reserva;
import com.sistema.reservas.model.StatusPagamento;
import com.sistema.reservas.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository repository;
    private final ReservaService reservaService;

    @Transactional
    public PagamentoDTO registrar(PagamentoDTO dto) {
        // 1. Busca a reserva no banco de dados (que já tem o valor correto)
        Reserva reserva = reservaService.buscarEntidade(dto.getIdReserva());
        
        if (repository.findByReservaIdReserva(reserva.getIdReserva()).isPresent()) {
            throw new BusinessException("Já existe um pagamento para esta reserva.");
        }
        
        // 2. Constrói o pagamento usando o valor da própria reserva
        Pagamento pagamento = Pagamento.builder()
                .formaPagamento(dto.getFormaPagamento())
                .statusPagamento(StatusPagamento.pendente)
                .valorPago(reserva.getValorReserva()) // <-- A TRAVA DE SEGURANÇA AQUI
                .reserva(reserva)
                .build();
                
        return toDTO(repository.save(pagamento));
    }

    @Transactional
    public PagamentoDTO confirmar(Long id) {
        Pagamento pagamento = buscarEntidade(id);
        
        if (pagamento.getStatusPagamento() == StatusPagamento.pago) {
            throw new BusinessException("Este pagamento já foi confirmado.");
        }
        
        pagamento.setStatusPagamento(StatusPagamento.pago);
        return toDTO(repository.save(pagamento));
    }

    @Transactional(readOnly = true)
    public PagamentoDTO buscarPorReserva(Long idReserva) {
        Pagamento pagamento = repository.findByReservaIdReserva(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado para reserva: " + idReserva));
        return toDTO(pagamento);
    }

    private Pagamento buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado: " + id));
    }

    private PagamentoDTO toDTO(Pagamento p) {
        return PagamentoDTO.builder()
                .idPagamento(p.getIdPagamento())
                .formaPagamento(p.getFormaPagamento())
                .statusPagamento(p.getStatusPagamento())
                .valorPago(p.getValorPago())
                .idReserva(p.getReserva().getIdReserva())
                .build();
    }

    // NOVO MÉTODO: Para fazer o GET /status/{status} funcionar
    @Transactional(readOnly = true)
    public List<PagamentoDTO> listarPorStatus(StatusPagamento status) {
        return repository.findByStatusPagamento(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // NOVO MÉTODO: Para reverter um pagamento confirmado acidentalmente
    @Transactional
    public PagamentoDTO reverter(Long id) {
        Pagamento pagamento = buscarEntidade(id);
        
        // Trava de segurança: só reverte se já estiver pago
        if (pagamento.getStatusPagamento() == StatusPagamento.pendente) {
            throw new BusinessException("Este pagamento já está com o status pendente.");
        }
        
        pagamento.setStatusPagamento(StatusPagamento.pendente);
        return toDTO(repository.save(pagamento));
    }
}
