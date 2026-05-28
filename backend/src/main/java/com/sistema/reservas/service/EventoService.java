package com.sistema.reservas.service;

import com.sistema.reservas.dto.EventoDTO;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Administrador;
import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.StatusEvento;
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
    private final AdministradorService administradorService;

    @Transactional
    public EventoDTO criar(EventoDTO dto) {
        Administrador admin = administradorService.buscarEntidade(dto.getIdAdmin());
        Evento evento = Evento.builder()
                .nomeEvento(dto.getNomeEvento())
                .dataHoraEvento(dto.getDataHoraEvento())
                .local(dto.getLocal())
                .limiteProdutos(dto.getLimiteProdutos())
                .statusEvento(StatusEvento.planejamento)
                .administrador(admin)
                .build();
        return toDTO(repository.save(evento));
    }

    @Transactional
    public EventoDTO editar(Long id, EventoDTO dto) {
        Evento evento = buscarEntidade(id);
        evento.setNomeEvento(dto.getNomeEvento());
        evento.setDataHoraEvento(dto.getDataHoraEvento());
        evento.setLocal(dto.getLocal());
        evento.setLimiteProdutos(dto.getLimiteProdutos());
        if (dto.getStatusEvento() != null) {
            evento.setStatusEvento(dto.getStatusEvento());
        }
        return toDTO(repository.save(evento));
    }

    @Transactional
    public EventoDTO atualizarStatus(Long id, StatusEvento status) {
        Evento evento = buscarEntidade(id);
        evento.setStatusEvento(status);
        return toDTO(repository.save(evento));
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
    public List<EventoDTO> listarAbertos() {
        return repository.findByStatusEvento(StatusEvento.aberto)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarPorStatus(StatusEvento status) {
        return repository.findByStatusEvento(status)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Evento buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado: " + id));
    }

    private EventoDTO toDTO(Evento e) {
        return EventoDTO.builder()
                .idEvento(e.getIdEvento())
                .nomeEvento(e.getNomeEvento())
                .dataHoraEvento(e.getDataHoraEvento())
                .local(e.getLocal())
                .limiteProdutos(e.getLimiteProdutos())
                .statusEvento(e.getStatusEvento())
                .idAdmin(e.getAdministrador().getIdAdmin())
                .nomeAdmin(e.getAdministrador().getUsuario())
                .build();
    }
}
