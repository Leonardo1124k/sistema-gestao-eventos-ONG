package com.sistema.reservas.repository;

import com.sistema.reservas.model.Retirada;
import com.sistema.reservas.model.StatusRetirada;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetiradaRepository extends JpaRepository<Retirada, Long> {
    Optional<Retirada> findByReservaIdReserva(Long idReserva);

    // NOVO MÉTODO: Filtrar por status (pendente ou retirado)
    List<Retirada> findByStatusRetirada(StatusRetirada statusRetirada);
}
