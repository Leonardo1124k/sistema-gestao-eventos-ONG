package com.sistema.reservas.service;

import com.sistema.reservas.dto.DoacaoBazarDTO;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.DoacaoBazar;
import com.sistema.reservas.model.Evento;
import com.sistema.reservas.model.StatusDoacao;
import com.sistema.reservas.model.Usuario;
import com.sistema.reservas.repository.DoacaoBazarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoacaoBazarService {

    private final DoacaoBazarRepository repository;
    private final UsuarioService usuarioService;
    private final EventoService eventoService;

    @Transactional
    public DoacaoBazarDTO criar(DoacaoBazarDTO dto) {
        Usuario usuario = usuarioService.buscarEntidade(dto.getIdUsuario());
        Evento evento = eventoService.buscarEntidade(dto.getIdEvento());

        DoacaoBazar doacao = DoacaoBazar.builder()
                .usuario(usuario)
                .evento(evento)
                .tiposItens(dto.getTiposItens())
                .quantidade(dto.getQuantidade())
                .descricao(dto.getDescricao())
                .statusDoacao(StatusDoacao.pendente)
                .build();

        DoacaoBazar saved = repository.save(doacao);
        return toDTO(saved);
    }

    @Transactional
    public void receberDoacao(Long id) {
        DoacaoBazar doacao = buscarEntidade(id);
        doacao.receberDoacao();
        repository.save(doacao);
    }

    @Transactional(readOnly = true)
    public DoacaoBazarDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public DoacaoBazarDTO buscarPorCodigo(String codigo) {
        DoacaoBazar doacao = repository.findByCodigoDoacao(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada com código: " + codigo));
        return toDTO(doacao);
    }

    @Transactional(readOnly = true)
    public List<DoacaoBazarDTO> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoacaoBazarDTO> listarPorEvento(Long idEvento) {
        return repository.findByEventoIdEvento(idEvento).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DoacaoBazar buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada: " + id));
    }

    private DoacaoBazarDTO toDTO(DoacaoBazar d) {
        return DoacaoBazarDTO.builder()
                .idDoacao(d.getIdDoacao())
                .idUsuario(d.getUsuario().getIdUsuario())
                .nomeUsuario(d.getUsuario().getNome())
                .emailUsuario(d.getUsuario().getEmail())
                .idEvento(d.getEvento().getIdEvento())
                .nomeEvento(d.getEvento().getNomeEvento())
                .tiposItens(d.getTiposItens())
                .quantidade(d.getQuantidade())
                .descricao(d.getDescricao())
                .statusDoacao(d.getStatusDoacao())
                .codigoDoacao(d.getCodigoDoacao())
                .dataCriacaoBazar(d.getDataCriacaoBazar())
                .build();
    }
}
