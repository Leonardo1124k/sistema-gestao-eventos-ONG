package com.sistema.reservas.service;

import com.sistema.reservas.dto.EventoDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.StatusEvento;
import com.sistema.reservas.model.TipoEvento;
import com.sistema.reservas.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository repository;

    @Transactional
    public EventoDTO criar(EventoDTO dto) {
        Evento evento = Evento.builder()
                .nomeEvento(dto.getNomeEvento())
                .tipoEvento(dto.getTipoEvento())
                .descricao(dto.getDescricao())
                .dataEvento(dto.getDataEvento())
                .localEvento(dto.getLocalEvento())
                .limiteVendas(dto.getLimiteVendas())
                .statusEvento(StatusEvento.ativo)
                .build();
        Evento saved = repository.save(evento);
        return toDTO(saved);
    }

    @Transactional
    public EventoDTO editar(Long id, EventoDTO dto) {
        Evento evento = buscarEntidade(id);
        evento.setNomeEvento(dto.getNomeEvento());
        evento.setTipoEvento(dto.getTipoEvento());
        evento.setDescricao(dto.getDescricao());
        evento.setDataEvento(dto.getDataEvento());
        evento.setLocalEvento(dto.getLocalEvento());
        evento.setLimiteVendas(dto.getLimiteVendas());
        return toDTO(repository.save(evento));
    }

    @Transactional
    public void ativar(Long id) {
        Evento evento = buscarEntidade(id);
        evento.ativar();
        repository.save(evento);
    }

    @Transactional
    public void desativar(Long id) {
        Evento evento = buscarEntidade(id);
        evento.desativar();
        repository.save(evento);
    }

    @Transactional(readOnly = true)
    public EventoDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarAtivos() {
        return repository.findByStatusEvento(StatusEvento.ativo).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarPorTipo(TipoEvento tipo) {
        return repository.findByTipoEvento(tipo).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Evento buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado: " + id));
    }

    private EventoDTO toDTO(Evento e) {
        return EventoDTO.builder()
                .idEvento(e.getIdEvento())
                .nomeEvento(e.getNomeEvento())
                .tipoEvento(e.getTipoEvento())
                .descricao(e.getDescricao())
                .dataEvento(e.getDataEvento())
                .localEvento(e.getLocalEvento())
                .limiteVendas(e.getLimiteVendas())
                .dataCriacaoEvento(e.getDataCriacaoEvento())
                .statusEvento(e.getStatusEvento())
                .build();
    }
}
