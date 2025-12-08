package com.ongmoradiadigna.api.repository;

import com.ongmoradiadigna.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Nenhum método customizado é necessário por enquanto.
    // JpaRepository já nos dá tudo o que precisamos para começar.
}
