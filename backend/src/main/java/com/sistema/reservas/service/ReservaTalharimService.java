package com.sistema.reservas.service;

import com.sistema.reservas.dto.ReservaTalharimDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.ReservaTalharim;
import com.sistema.reservas.model.StatusPagamento;
import com.sistema.reservas.model.StatusReserva;
import com.sistema.reservas.model.StatusRetirada;
import com.sistema.reservas.model.Usuario;
import com.sistema.reservas.repository.ReservaTalharimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaTalharimService {

    private final ReservaTalharimRepository repository;
    private final UsuarioService usuarioService;
    private final EventoService eventoService;

    @Transactional
    public ReservaTalharimDTO criar(ReservaTalharimDTO dto) {
        Usuario usuario = usuarioService.buscarEntidade(dto.getIdUsuario());
        Evento evento = eventoService.buscarEntidade(dto.getIdEvento());

        // Check if event has limit and capacity
        if (evento.getLimiteVendas() != null) {
            long totalReservadas = repository.findByEventoIdEvento(evento.getIdEvento())
                    .stream()
                    .filter(r -> r.getStatusReserva() == StatusReserva.ativa)
                    .mapToLong(ReservaTalharim::getQuantidade)
                    .sum();
            if (totalReservadas + dto.getQuantidade() > evento.getLimiteVendas()) {
                throw new BusinessException("Limite de vendas do evento excedido. Capacidade restante: " + (evento.getLimiteVendas() - totalReservadas));
            }
        }

        ReservaTalharim reserva = ReservaTalharim.builder()
                .usuario(usuario)
                .evento(evento)
                .quantidade(dto.getQuantidade())
                .formaPagamento(dto.getFormaPagamento())
                .observacoes(dto.getObservacoes())
                .statusReserva(StatusReserva.ativa)
                .statusRetirada(StatusRetirada.nao_retirado)
                .statusPagamento(StatusPagamento.nao_pago)
                .build();

        ReservaTalharim saved = repository.save(reserva);
        return toDTO(saved);
    }

    @Transactional
    public void cancelar(Long id) {
        ReservaTalharim reserva = buscarEntidade(id);
        reserva.cancelar();
        repository.save(reserva);
    }

    @Transactional
    public void registrarPagamento(Long id) {
        ReservaTalharim reserva = buscarEntidade(id);
        reserva.registrarPagamento();
        repository.save(reserva);
    }

    @Transactional
    public void registrarRetirada(Long id) {
        ReservaTalharim reserva = buscarEntidade(id);
        reserva.registrarRetirada();
        repository.save(reserva);
    }

    @Transactional(readOnly = true)
    public ReservaTalharimDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public ReservaTalharimDTO buscarPorCodigo(String codigo) {
        ReservaTalharim reserva = repository.findByCodigoReserva(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada com código: " + codigo));
        return toDTO(reserva);
    }

    @Transactional(readOnly = true)
    public List<ReservaTalharimDTO> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaTalharimDTO> listarPorEvento(Long idEvento) {
        return repository.findByEventoIdEvento(idEvento).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReservaTalharim buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada: " + id));
    }

    private ReservaTalharimDTO toDTO(ReservaTalharim r) {
        return ReservaTalharimDTO.builder()
                .idReserva(r.getIdReserva())
                .idUsuario(r.getUsuario().getIdUsuario())
                .nomeUsuario(r.getUsuario().getNome())
                .emailUsuario(r.getUsuario().getEmail())
                .idEvento(r.getEvento().getIdEvento())
                .nomeEvento(r.getEvento().getNomeEvento())
                .quantidade(r.getQuantidade())
                .formaPagamento(r.getFormaPagamento())
                .observacoes(r.getObservacoes())
                .statusReserva(r.getStatusReserva())
                .statusRetirada(r.getStatusRetirada())
                .statusPagamento(r.getStatusPagamento())
                .codigoReserva(r.getCodigoReserva())
                .dataCriacaoTalharim(r.getDataCriacaoTalharim())
                .build();
    }
}
