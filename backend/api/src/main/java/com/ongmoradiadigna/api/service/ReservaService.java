package com.ongmoradiadigna.api.service;

import com.ongmoradiadigna.api.model.Evento;
import com.ongmoradiadigna.api.model.ReservaTalharim;
import com.ongmoradiadigna.api.model.Usuario;
import com.ongmoradiadigna.api.repository.EventoRepository;
import com.ongmoradiadigna.api.repository.ReservaTalharimRepository;
import com.ongmoradiadigna.api.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class ReservaService {

    @Autowired private ReservaTalharimRepository reservaRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EventoRepository eventoRepository;

    public ReservaTalharim criarReserva(Long idUsuario, Long idEvento, Integer quantidade, String observacoes) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        Evento evento = eventoRepository.findById(idEvento).orElseThrow(() -> new EntityNotFoundException("Evento não encontrado."));

        if (evento.getTipo_evento() != Evento.TipoEvento.talharim) {
            throw new IllegalArgumentException("Reservas são apenas para eventos 'talharim'.");
        }

        if (evento.getLimite_vendas() != null) {
            Integer qtdReservada = reservaRepository.sumQuantidadeByEvento(idEvento);
            if (qtdReservada != null && (qtdReservada + quantidade) > evento.getLimite_vendas()) {
                throw new IllegalStateException("Limite de vendas para o evento excedido.");
            }
        }

        ReservaTalharim novaReserva = new ReservaTalharim();
        novaReserva.setUsuario(usuario);
        novaReserva.setEvento(evento);
        novaReserva.setQuantidade(quantidade);
        novaReserva.setObservacoes(observacoes);
        novaReserva.setCodigo_reserva(gerarCodigoUnico("TLR"));

        return reservaRepository.save(novaReserva);
    }

    public List<ReservaTalharim> getReservasPorEvento(Long idEvento) {
        return reservaRepository.findByEventoIdEvento(idEvento);
    }

    public ReservaTalharim atualizarStatusRetirada(Long idReserva, String status) {
        ReservaTalharim reserva = reservaRepository.findById(idReserva).orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada."));
        reserva.setStatus_retirada(ReservaTalharim.StatusRetirada.valueOf(status));
        return reservaRepository.save(reserva);
    }

    public ReservaTalharim atualizarStatusPagamento(Long idReserva, String status) {
        ReservaTalharim reserva = reservaRepository.findById(idReserva).orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada."));
        reserva.setStatus_pagamento(ReservaTalharim.StatusPagamento.valueOf(status));
        return reservaRepository.save(reserva);
    }

    public ReservaTalharim atualizarStatusReserva(Long idReserva, String status) {
        ReservaTalharim reserva = reservaRepository.findById(idReserva).orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada."));
        reserva.setStatus_reserva(ReservaTalharim.StatusReserva.valueOf(status));
        return reservaRepository.save(reserva);
    }
    
    /**
     * Deleta uma reserva pelo ID.
     * @param idReserva ID da reserva a ser deletada.
     */
    public void deletarReserva(Long idReserva) {
        if (!reservaRepository.existsById(idReserva)) {
            throw new EntityNotFoundException("Reserva com ID " + idReserva + " não encontrada para exclusão.");
        }
        reservaRepository.deleteById(idReserva);
    }

    private String gerarCodigoUnico(String prefixo) {
        String ano = String.valueOf(Year.now().getValue());
        String hash = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("%s-%s-%s", prefixo, ano, hash);
    }
}
