/**
 * talharim-reserva.js — Formulário de reserva de Talharim
 *
 * Fluxo completo integrado com o backend:
 *   1. Busca eventos abertos → seleciona o primeiro
 *   2. Busca produtos → encontra o produto de talharim
 *   3. Verifica se cliente já existe pelo CPF
 *       → Não existe: cadastra novo cliente
 *       → Existe: usa o ID existente
 *   4. Cria a reserva (POST /api/reservas)
 *   5. Registra o pagamento (POST /api/pagamentos)
 *   6. Salva dados de confirmação e redireciona
 */

const API_BASE_URL_LOCAL = 'http://localhost:8080/api';

// ─── Inicialização ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async function () {
  configurarMascaraTelefone();
  configurarValidacaoQuantidade();
  await carregarInfoEvento();

  const form = document.getElementById('reservaForm');
  if (form) {
    form.addEventListener('submit', handleSubmitReserva);
  }
});

// ─── Carrega info do evento aberto ───────────────────────────────────────────

async function carregarInfoEvento() {
  const infoEvento = document.getElementById('infoEvento');
  const labelEvento = document.getElementById('labelEvento');

  try {
    const eventos = await apiFetch('/eventos/abertos');

    if (!eventos || eventos.length === 0) {
      mostrarErroGlobal('Não há eventos de Talharim abertos no momento. Tente novamente mais tarde.');
      desabilitarFormulario();
      return;
    }

    const evento = eventos[0];

    if (labelEvento) {
      labelEvento.textContent = `${evento.nomeEvento} — ${formatarData(evento.dataHoraEvento)}`;
    }

    if (infoEvento) {
      infoEvento.style.display = '';
    }

    // Guarda o evento no campo oculto
    document.getElementById('eventoId').value = evento.idEvento;

  } catch (err) {
    mostrarErroGlobal('Não foi possível carregar o evento. Verifique sua conexão com o servidor.');
    desabilitarFormulario();
  }
}

// ─── Submit do formulário ─────────────────────────────────────────────────────

async function handleSubmitReserva(e) {
  e.preventDefault();
  esconderErroGlobal();

  const btn = document.getElementById('btnSubmit');
  setLoading(btn, true);

  try {
    // 1. Coletar dados do formulário
    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const formaPagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();
    const idEvento = parseInt(document.getElementById('eventoId').value);

    // 2. Validação básica
    if (!nomeCompleto || !email || !telefone || !cpf || !quantidade || !formaPagamento || !idEvento) {
      mostrarErroGlobal('Por favor, preencha todos os campos obrigatórios.');
      setLoading(btn, false);
      return;
    }

    // 3. Buscar produtos e encontrar o Talharim
    const produtos = await apiFetch('/produtos');
    if (!produtos || produtos.length === 0) {
      mostrarErroGlobal('Não há produtos disponíveis no momento. Contate o administrador.');
      setLoading(btn, false);
      return;
    }

    // Usa o primeiro produto encontrado (produto de talharim cadastrado no backend)
    // Prioriza produto cujo nome contenha "talharim" (case-insensitive), senão usa o primeiro
    const produtoTalharim =
      produtos.find(p => p.nomeProduto.toLowerCase().includes('talharim')) ||
      produtos[0];

    const valorTotal = produtoTalharim.precoProduto * quantidade;

    // 4. Verificar ou cadastrar cliente
    const cpfLimpo = cpf.replace(/\D/g, '');
    let idCliente;

    try {
      // Tenta buscar cliente existente pelo CPF
      const clienteExistente = await apiFetch(`/clientes/cpf/${cpfLimpo}`);
      idCliente = clienteExistente.idCliente;
    } catch (errCliente) {
      // Cliente não existe → cadastra novo
      try {
        const novoCliente = await apiFetch('/clientes', {
          method: 'POST',
          body: JSON.stringify({
            nome: nomeCompleto,
            email: email,
            telefone: telefone,
            cpf: cpfLimpo,
          }),
        });
        idCliente = novoCliente.idCliente;
      } catch (errCadastro) {
        mostrarErroGlobal(`Erro ao cadastrar cliente: ${errCadastro.message}`);
        setLoading(btn, false);
        return;
      }
    }

    // 5. Criar reserva
    const reservaPayload = {
      idCliente: idCliente,
      idEvento: idEvento,
      observacoes: observacoes || null,
      itens: [
        {
          idProduto: produtoTalharim.idProduto,
          quantItem: quantidade,
        },
      ],
    };

    let reservaCriada;
    try {
      reservaCriada = await apiFetch('/reservas', {
        method: 'POST',
        body: JSON.stringify(reservaPayload),
      });
    } catch (errReserva) {
      mostrarErroGlobal(`Erro ao criar reserva: ${errReserva.message}`);
      setLoading(btn, false);
      return;
    }

    // 6. Registrar pagamento
    let pagamentoCriado;
    try {
      pagamentoCriado = await apiFetch('/pagamentos', {
        method: 'POST',
        body: JSON.stringify({
          idReserva: reservaCriada.idReserva,
          formaPagamento: formaPagamento, // 'pix' | 'dinheiro' | 'cartao'
          valorPago: valorTotal,
        }),
      });
    } catch (errPag) {
      // Reserva foi criada mas pagamento falhou — avisa mas continua
      console.warn('Pagamento não registrado:', errPag.message);
    }

    // 7. Salvar dados de confirmação no localStorage para exibir na próxima página
    localStorage.setItem('ultimaReserva', JSON.stringify({
      codigo: reservaCriada.codigoConfirmacao,
      nomeCompleto: nomeCompleto,
      quantidade: quantidade,
      nomeProduto: produtoTalharim.nomeProduto,
      precoProduto: produtoTalharim.precoProduto,
      valorTotal: valorTotal,
      formaPagamento: formaPagamento,
      nomeEvento: reservaCriada.nomeEvento,
      dataHoraReserva: reservaCriada.dataHoraReserva,
      idReserva: reservaCriada.idReserva,
      statusPagamento: pagamentoCriado ? pagamentoCriado.statusPagamento : 'pendente',
    }));

    // 8. Redirecionar para confirmação
    window.location.href = 'talharim-confirmacao.html';

  } catch (err) {
    mostrarErroGlobal(`Ocorreu um erro inesperado: ${err.message}`);
    setLoading(btn, false);
  }
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────

function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Aguarde...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || 'Confirmar Reserva';
  }
}

function mostrarErroGlobal(msg) {
  const el = document.getElementById('erroGlobal');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    alert(msg);
  }
}

function esconderErroGlobal() {
  const el = document.getElementById('erroGlobal');
  if (el) el.style.display = 'none';
}

function desabilitarFormulario() {
  const form = document.getElementById('reservaForm');
  if (form) {
    form.querySelectorAll('input, select, textarea, button[type=submit]').forEach(el => {
      el.disabled = true;
    });
  }
}

function formatarData(dataHoraStr) {
  if (!dataHoraStr) return '';
  const data = new Date(dataHoraStr);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Máscara de telefone ──────────────────────────────────────────────────────

function configurarMascaraTelefone() {
  const tel = document.getElementById('telefone');
  if (!tel) return;
  tel.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    e.target.value = value;
  });
}

// ─── Máscara de CPF ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  const cpfInput = document.getElementById('cpf');
  if (!cpfInput) return;
  cpfInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    e.target.value = value;
  });
});

// ─── Validação quantidade ─────────────────────────────────────────────────────

function configurarValidacaoQuantidade() {
  const qtd = document.getElementById('quantidade');
  if (!qtd) return;
  qtd.addEventListener('change', function (e) {
    if (parseInt(e.target.value) < 1 || isNaN(parseInt(e.target.value))) {
      e.target.value = 1;
    }
  });
}

// ─── apiFetch local (sem depender de api.js carregado antes) ─────────────────
// Esta função é uma cópia inline para garantir que funcione mesmo se api.js
// não for carregado antes deste script.

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL_LOCAL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg =
      (data && (data.message || data.error || JSON.stringify(data))) ||
      `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}
