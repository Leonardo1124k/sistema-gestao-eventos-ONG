package com.sistema.reservas.service;

import com.sistema.reservas.dto.ProdutoDTO;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.Produto;
import com.sistema.reservas.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;

    @Transactional
    public ProdutoDTO criar(ProdutoDTO dto) {
        Produto produto = Produto.builder()
                .nomeProduto(dto.getNomeProduto())
                .precoProduto(dto.getPrecoProduto())
                .build();
        return toDTO(repository.save(produto));
    }

    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoDTO dto) {
        Produto produto = buscarEntidade(id);
        produto.setNomeProduto(dto.getNomeProduto());
        produto.setPrecoProduto(dto.getPrecoProduto());
        return toDTO(repository.save(produto));
    }

    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Produto buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    private ProdutoDTO toDTO(Produto p) {
        return ProdutoDTO.builder()
                .idProduto(p.getIdProduto())
                .nomeProduto(p.getNomeProduto())
                .precoProduto(p.getPrecoProduto())
                .build();
    }
}
