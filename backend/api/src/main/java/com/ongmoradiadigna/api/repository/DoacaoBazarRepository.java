package com.ongmoradiadigna.api.repository;

import com.ongmoradiadigna.api.model.DoacaoBazar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoacaoBazarRepository extends JpaRepository<DoacaoBazar, Long> {

    // Método para buscar doações por ID do evento, conforme solicitado na API (GET /doacoes/:id_evento)
    List<DoacaoBazar> findByEventoIdEvento(Long idEvento);
}
