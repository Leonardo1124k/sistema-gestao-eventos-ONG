package com.ongmoradiadigna.api.repository;

import com.ongmoradiadigna.api.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    // O Spring Data JPA permite criar consultas baseadas no nome do método.
    // Por exemplo, se precisarmos buscar eventos por tipo, poderíamos adicionar:
    // List<Evento> findByTipoEvento(Evento.TipoEvento tipo);
}
