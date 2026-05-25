package com.sistema.reservas.repository;

import com.sistema.reservas.model.ReservaTalharim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaTalharimRepository extends JpaRepository<ReservaTalharim, Long> {
    Optional<ReservaTalharim> findByCodigoReserva(String codigoReserva);
    List<ReservaTalharim> findByUsuarioIdUsuario(Long idUsuario);
    List<ReservaTalharim> findByEventoIdEvento(Long idEvento);
}
