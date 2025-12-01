package com.ongmoradiadigna.api.repository;

import com.ongmoradiadigna.api.model.ReservaTalharim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaTalharimRepository extends JpaRepository<ReservaTalharim, Long> {

    // Método para buscar reservas por ID do evento, conforme solicitado na API (GET /reservas/:id_evento)
    List<ReservaTalharim> findByEventoIdEvento(Long idEvento);

    // Método para controlar a capacidade do talharim.
    // Ele soma a quantidade de todas as reservas 'ativas' para um determinado evento.
    @Query("SELECT SUM(r.quantidade) FROM ReservaTalharim r WHERE r.evento.id_evento = :idEvento AND r.status_reserva = 'ativa'")
    Integer sumQuantidadeByEvento(Long idEvento);
}
