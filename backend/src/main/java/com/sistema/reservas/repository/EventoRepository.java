package com.sistema.reservas.repository;

import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.StatusEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByStatusEvento(StatusEvento statusEvento);
    List<Evento> findByAdministradorIdAdmin(Long idAdmin);
}
