package com.sistema.reservas.repository;

import com.sistema.reservas.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    Optional<Reserva> findByCodigoConfirmacao(String codigoConfirmacao);
    List<Reserva> findByClienteIdCliente(Long idCliente);
    List<Reserva> findByEventoIdEvento(Long idEvento);
}
