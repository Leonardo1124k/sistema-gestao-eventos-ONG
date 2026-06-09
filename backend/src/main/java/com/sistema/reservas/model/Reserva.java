package com.sistema.reservas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long idReserva;

    @Column(name = "codigo_confirmacao", nullable = false, unique = true, length = 20)
    private String codigoConfirmacao;

    @Column(name = "data_hora_reserva", nullable = false)
    private LocalDateTime dataHoraReserva;

    @NotNull(message = "Valor da reserva é obrigatório")
    @Column(name = "valor_reserva", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorReserva;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @NotNull(message = "Cliente é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_cliente", nullable = false)
    private Cliente cliente;

    @NotNull(message = "Evento é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_evento", nullable = false)
    private Evento evento;

    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Pagamento pagamento;

    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Retirada retirada;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReservaProduto> itens; //Para garantir que uma exclusão da lista reflita no banco, adicione o parâmetro orphanRemoval = true:

    @PrePersist
    public void prePersist() {
        if (this.codigoConfirmacao == null) {
            this.codigoConfirmacao = UUID.randomUUID().toString()
                    .replace("-", "").substring(0, 20).toUpperCase();
        }
        if (this.dataHoraReserva == null) {
            this.dataHoraReserva = LocalDateTime.now();
        }
    }
}
