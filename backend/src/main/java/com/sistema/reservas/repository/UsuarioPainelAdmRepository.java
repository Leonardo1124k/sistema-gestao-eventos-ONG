package com.sistema.reservas.repository;

import com.sistema.reservas.model.UsuarioPainelAdm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioPainelAdmRepository extends JpaRepository<UsuarioPainelAdm, Long> {
    Optional<UsuarioPainelAdm> findByEmail(String email);
    boolean existsByEmail(String email);
}
