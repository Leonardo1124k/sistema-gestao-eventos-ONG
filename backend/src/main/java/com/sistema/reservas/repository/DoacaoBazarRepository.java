package com.sistema.reservas.repository;

import com.sistema.reservas.model.DoacaoBazar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoacaoBazarRepository extends JpaRepository<DoacaoBazar, Long> {
    Optional<DoacaoBazar> findByCodigoDoacao(String codigoDoacao);
    List<DoacaoBazar> findByUsuarioIdUsuario(Long idUsuario);
    List<DoacaoBazar> findByEventoIdEvento(Long idEvento);
}
