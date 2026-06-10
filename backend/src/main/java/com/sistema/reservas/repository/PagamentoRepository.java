package com.sistema.reservas.repository;

import com.sistema.reservas.model.Pagamento;
import com.sistema.reservas.model.StatusPagamento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    Optional<Pagamento> findByReservaIdReserva(Long idReserva);
    
    // NOVO MÉTODO: O Spring vai gerar a query SQL automaticamente
    List<Pagamento> findByStatusPagamento(StatusPagamento statusPagamento);
}
