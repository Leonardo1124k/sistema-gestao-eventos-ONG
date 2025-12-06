package com.ongmoradiadigna.api.service;

import com.ongmoradiadigna.api.model.DoacaoBazar;
import com.ongmoradiadigna.api.model.Evento;
import com.ongmoradiadigna.api.model.Usuario;
import com.ongmoradiadigna.api.repository.DoacaoBazarRepository;
import com.ongmoradiadigna.api.repository.EventoRepository;
import com.ongmoradiadigna.api.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class DoacaoService {

    @Autowired private DoacaoBazarRepository doacaoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EventoRepository eventoRepository;

    public DoacaoBazar criarDoacao(Long idUsuario, Long idEvento, String tiposItens, Integer quantidade, String descricao) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        Evento evento = eventoRepository.findById(idEvento).orElseThrow(() -> new EntityNotFoundException("Evento não encontrado."));

        if (evento.getTipo_evento() != Evento.TipoEvento.bazar) {
            throw new IllegalArgumentException("Doações são apenas para eventos 'bazar'.");
        }

        DoacaoBazar novaDoacao = new DoacaoBazar();
        novaDoacao.setUsuario(usuario);
        novaDoacao.setEvento(evento);
        novaDoacao.setTipos_itens(tiposItens);
        novaDoacao.setQuantidade(quantidade);
        novaDoacao.setDescricao(descricao);
        novaDoacao.setCodigo_doacao(gerarCodigoUnico("BZR"));

        return doacaoRepository.save(novaDoacao);
    }

    public List<DoacaoBazar> getDoacoesPorEvento(Long idEvento) {
        return doacaoRepository.findByEventoIdEvento(idEvento);
    }

    public DoacaoBazar atualizarStatusDoacao(Long idDoacao, String status) {
        DoacaoBazar doacao = doacaoRepository.findById(idDoacao).orElseThrow(() -> new EntityNotFoundException("Doação não encontrada."));
        doacao.setStatus_doacao(DoacaoBazar.StatusDoacao.valueOf(status));
        doacao.setData_atualizacao(LocalDate.now()); // Atualiza a data automaticamente
        return doacaoRepository.save(doacao);
    }
    
    /**
     * Deleta uma doação pelo ID.
     * @param idDoacao ID da doação a ser deletada.
     */
    public void deletarDoacao(Long idDoacao) {
        if (!doacaoRepository.existsById(idDoacao)) {
            throw new EntityNotFoundException("Doação com ID " + idDoacao + " não encontrada para exclusão.");
        }
        doacaoRepository.deleteById(idDoacao);
    }

    private String gerarCodigoUnico(String prefixo) {
        String ano = String.valueOf(Year.now().getValue());
        String hash = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("%s-%s-%s", prefixo, ano, hash);
    }
}
