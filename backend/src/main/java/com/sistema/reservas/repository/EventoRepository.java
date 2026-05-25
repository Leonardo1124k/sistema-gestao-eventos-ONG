package com.sistema.reservas.repository;

import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.StatusEvento;
import com.sistema.reservas.model.TipoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByStatusEvento(StatusEvento status);
    List<Evento> findByTipoEvento(TipoEvento tipo);
    List<Evento> findByStatusEventoAndTipoEvento(StatusEvento status, TipoEvento tipo);
}
