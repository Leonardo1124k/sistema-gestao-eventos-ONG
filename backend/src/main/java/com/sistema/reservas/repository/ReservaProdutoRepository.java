package com.sistema.reservas.repository;

import com.sistema.reservas.model.ReservaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaProdutoRepository extends JpaRepository<ReservaProduto, Long> {
    List<ReservaProduto> findByReservaIdReserva(Long idReserva);
}
