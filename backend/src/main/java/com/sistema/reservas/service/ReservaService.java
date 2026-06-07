package com.sistema.reservas.service;

import com.sistema.reservas.dto.ReservaProdutoDTO;
import com.sistema.reservas.dto.ReservaDTO;
import com.sistema.reservas.dto.PagamentoDTO;
import com.sistema.reservas.dto.RetiradaDTO;
import com.sistema.reservas.exception.BusinessException;
import com.sistema.reservas.exception.ResourceNotFoundException;
import com.sistema.reservas.model.*;
import com.sistema.reservas.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository repository;
    private final ClienteService clienteService;
    private final EventoService eventoService;
    private final ProdutoService produtoService;

    @Transactional
    public ReservaDTO criar(ReservaDTO dto) {
        Cliente cliente = clienteService.buscarEntidade(dto.getIdCliente());
        Evento evento = eventoService.buscarEntidade(dto.getIdEvento());

        if (evento.getStatusEvento() != StatusEvento.aberto) {
            throw new BusinessException("Evento não está aberto para reservas.");
        }

        Reserva reserva = Reserva.builder()
                .cliente(cliente)
                .evento(evento)
                .observacoes(dto.getObservacoes())
                // Não setamos o valorReserva ainda
                .build();

        BigDecimal valorTotalReserva = BigDecimal.ZERO;

        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            List<ReservaProduto> itens = new ArrayList<>();
            
            for (ReservaProdutoDTO itemDTO : dto.getItens()) {
                Produto produto = produtoService.buscarEntidade(itemDTO.getIdProduto());
                
                // Backend calcula o valor real do item (Preço do BD * Quantidade)
                BigDecimal valorRealItem = produto.getPrecoProduto()
                        .multiply(BigDecimal.valueOf(itemDTO.getQuantItem()));
                
                ReservaProduto item = ReservaProduto.builder()
                        .reserva(reserva)
                        .produto(produto)
                        .quantItem(itemDTO.getQuantItem())
                        .valor(valorRealItem) // Valor seguro calculado aqui
                        .build();
                itens.add(item);
                
                // Soma ao total da reserva
                valorTotalReserva = valorTotalReserva.add(valorRealItem);
            }
            reserva.setItens(itens);
        } else {
            throw new BusinessException("A reserva deve conter pelo menos um produto.");
        }

        // Agora sim, setamos o valor total seguro
        reserva.setValorReserva(valorTotalReserva);

        return toDTO(repository.save(reserva));
    }

    @Transactional(readOnly = true)
    public ReservaDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public ReservaDTO buscarPorCodigo(String codigo) {
        Reserva reserva = repository.findByCodigoConfirmacao(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada com código: " + codigo));
        return toDTO(reserva);
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> listarPorCliente(Long idCliente) {
        return repository.findByClienteIdCliente(idCliente)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> listarPorEvento(Long idEvento) {
        return repository.findByEventoIdEvento(idEvento)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> listarTodas() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Reserva buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada: " + id));
    }

    private ReservaDTO toDTO(Reserva r) {
        List<ReservaProdutoDTO> itens = r.getItens() == null ? List.of() :
                r.getItens().stream().map(i -> ReservaProdutoDTO.builder()
                        .idReservaProduto(i.getIdReservaProduto())
                        .idProduto(i.getProduto().getIdProduto())
                        .nomeProduto(i.getProduto().getNomeProduto())
                        .quantItem(i.getQuantItem())
                        .valor(i.getValor())
                        .build()).collect(Collectors.toList());

        PagamentoDTO pagDTO = r.getPagamento() == null ? null : PagamentoDTO.builder()
                .idPagamento(r.getPagamento().getIdPagamento())
                .formaPagamento(r.getPagamento().getFormaPagamento())
                .statusPagamento(r.getPagamento().getStatusPagamento())
                .valorPago(r.getPagamento().getValorPago())
                .idReserva(r.getIdReserva())
                .build();

        RetiradaDTO retDTO = r.getRetirada() == null ? null : RetiradaDTO.builder()
                .idRetirada(r.getRetirada().getIdRetirada())
                .statusRetirada(r.getRetirada().getStatusRetirada())
                .dataHoraRetirada(r.getRetirada().getDataHoraRetirada())
                .idReserva(r.getIdReserva())
                .build();

        return ReservaDTO.builder()
                .idReserva(r.getIdReserva())
                .codigoConfirmacao(r.getCodigoConfirmacao())
                .dataHoraReserva(r.getDataHoraReserva())
                .valorReserva(r.getValorReserva())
                .observacoes(r.getObservacoes())
                .idCliente(r.getCliente().getIdCliente())
                .nomeCliente(r.getCliente().getNome())
                .cpfCliente(r.getCliente().getCpf())
                .idEvento(r.getEvento().getIdEvento())
                .nomeEvento(r.getEvento().getNomeEvento())
                .itens(itens)
                .pagamento(pagDTO)
                .retirada(retDTO)
                .build();
    }
}
