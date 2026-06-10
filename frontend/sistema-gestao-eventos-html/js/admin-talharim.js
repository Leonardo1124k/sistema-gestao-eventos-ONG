/**
 * admin-talharim.js — Painel administrativo do Talharim
 * Integrado com o backend: todas as operações usam a API REST.
 */

const API_BASE_ADMIN = 'http://136.248.121.28:8080/api';

// Cache das reservas carregadas da API
let reservasCache = [];

// ─── Inicialização ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  verificarAutenticacao();
  marcarMenuAtivo('admin-talharim.html');

  // Filtros
  document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', filtrarReservas);
  });
  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', filtrarReservas);
  });

  // Exportação
  document.querySelectorAll('.btn-export').forEach((btn, index) => {
    btn.addEventListener('click', function () {
      if (index === 0) exportarCSV();
      else exportarExcel();
    });
  });

  // Carrega dados da API
  carregarReservas();
});

// ─── Autenticação ─────────────────────────────────────────────────────────────

function verificarAutenticacao() {
  const adminLogado = localStorage.getItem('adminLogado');
  const adminUsuario = localStorage.getItem('adminUsuario');

  if (!adminLogado) {
    window.location.href = 'admin-login.html';
    return;
  }

  const nomeUsuario = document.getElementById('nomeUsuario');
  if (nomeUsuario && adminUsuario) {
    nomeUsuario.textContent = adminUsuario.toUpperCase();
  }
}

function getToken() {
  return localStorage.getItem('adminToken');
}

// ─── Fetch autenticado ────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_ADMIN}${path}`, { ...options, headers });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = (data && (data.message || data.error || JSON.stringify(data))) || `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

// ─── Carregar reservas ────────────────────────────────────────────────────────

async function carregarReservas() {
  const table = document.getElementById('reservasTable');
  if (table) {
    table.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 2rem; opacity: 0.6;">
          Carregando reservas...
        </td>
      </tr>`;
  }

  try {
    reservasCache = await apiFetch('/reservas') || [];
    renderizarTabela(reservasCache);
    atualizarEstatisticas(reservasCache);
  } catch (err) {
    console.error('Erro ao carregar reservas:', err);
    if (table) {
      table.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; color:#b91c1c; padding: 2rem;">
            Erro ao carregar reservas: ${err.message}
          </td>
        </tr>`;
    }
  }
}

// ─── Renderizar tabela ────────────────────────────────────────────────────────

function renderizarTabela(reservas) {
  const table = document.getElementById('reservasTable');
  if (!table) return;

  // Ordena por data mais recente
  const ordenadas = [...reservas].sort((a, b) =>
    new Date(b.dataHoraReserva || 0) - new Date(a.dataHoraReserva || 0)
  );

  if (ordenadas.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto 1rem; opacity: 0.5;">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>Nenhuma reserva registrada</div>
        </td>
      </tr>`;
    return;
  }

  table.innerHTML = ordenadas.map(r => {
    const statusRetirada = r.retirada ? r.retirada.statusRetirada : null;
    const statusPagamento = r.pagamento ? r.pagamento.statusPagamento : null;

    // Calcula quantidade total dos itens
    const qtdTotal = (r.itens || []).reduce((acc, item) => acc + (item.quantProduto || 0), 0);

    // Badge de retirada
    const retiradaTexto = getStatusRetiradaTexto(statusRetirada);
    const retiradaClasse = statusRetirada === 'retirado' ? 'confirmado' : 'pendente';

    // Badge de pagamento
    const pagamentoTexto = statusPagamento === 'pago' ? 'Pago' : 'Pendente';
    const pagamentoClasse = statusPagamento === 'pago' ? 'confirmado' : 'pendente';

    // Desabilitar botões
    const jaRetirado = statusRetirada === 'retirado';
    const jaPago = statusPagamento === 'pago';

    return `
    <tr data-id="${r.idReserva}"
        data-status-retirada="${statusRetirada || 'pendente'}"
        data-status-pagamento="${statusPagamento || 'pendente'}">
      <td><strong>${r.codigoConfirmacao || '—'}</strong></td>
      <td>${r.nomeCliente || '—'}</td>
      <td>${r.cpfCliente || '—'}</td>
      <td>${r.nomeEvento || '—'}</td>
      <td>${qtdTotal} ${qtdTotal === 1 ? 'porção' : 'porções'}</td>
      <td>
        <span class="status-badge status-${retiradaClasse}">${retiradaTexto}</span>
      </td>
      <td>
        <span class="status-badge status-${pagamentoClasse}">${pagamentoTexto}</span>
      </td>
      <td>
        <div class="action-buttons-single-row">
          <!-- Confirmar Retirada -->
          <button class="btn-action btn-confirm-retirada"
            onclick="acaoConfirmarRetirada(${r.idReserva}, ${r.retirada ? r.retirada.idRetirada : 'null'})"
            title="Confirmar Retirada"
            ${jaRetirado ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Confirmar Pagamento -->
          <button class="btn-action btn-confirm-pagamento"
            onclick="acaoConfirmarPagamento(${r.idReserva}, ${r.pagamento ? r.pagamento.idPagamento : 'null'})"
            title="Confirmar Pagamento"
            ${jaPago ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Ver Detalhes -->
          <button class="btn-action btn-view-details"
            onclick="verDetalhes(${r.idReserva})"
            title="Ver Detalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ─── Confirmar Retirada ───────────────────────────────────────────────────────

async function acaoConfirmarRetirada(idReserva, idRetirada) {
  if (!confirm('✅ Confirmar retirada desta reserva?\n\nApós confirmar, a retirada não poderá ser desfeita.')) return;

  try {
    if (idRetirada) {
      // Já existe retirada registrada → apenas confirma
      await apiFetch(`/retiradas/${idRetirada}/confirmar`, { method: 'PATCH' });
    } else {
      // Cria e já confirma de uma vez
      const retirada = await apiFetch(`/retiradas/reserva/${idReserva}`, { method: 'POST' });
      await apiFetch(`/retiradas/${retirada.idRetirada}/confirmar`, { method: 'PATCH' });
    }

    alert('✅ Retirada confirmada com sucesso!');
    await carregarReservas();
  } catch (err) {
    alert(`Erro ao confirmar retirada: ${err.message}`);
  }
}

// ─── Confirmar Pagamento ──────────────────────────────────────────────────────

async function acaoConfirmarPagamento(idReserva, idPagamento) {
  if (!confirm('💰 Confirmar pagamento desta reserva?\n\nEsta ação marcará o pagamento como pago.')) return;

  try {
    if (idPagamento) {
      await apiFetch(`/pagamentos/${idPagamento}/confirmar`, { method: 'PATCH' });
    } else {
      // Tenta buscar o pagamento pela reserva primeiro
      let pag;
      try {
        pag = await apiFetch(`/pagamentos/reserva/${idReserva}`);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('não encontrado')) {
          // Pagamento não existe (bug anterior ou não gerado) -> Cria um novo
          const reserva = reservasCache.find(r => r.idReserva === idReserva);
          const valor = reserva ? reserva.valorReserva : 0;
          pag = await apiFetch('/pagamentos', {
            method: 'POST',
            body: JSON.stringify({
              idReserva: idReserva,
              formaPagamento: 'dinheiro', // default se não tinha
              valorPago: valor
            })
          });
        } else {
          throw err;
        }
      }
      await apiFetch(`/pagamentos/${pag.idPagamento}/confirmar`, { method: 'PATCH' });
    }

    alert('✅ Pagamento confirmado com sucesso!');
    await carregarReservas();
  } catch (err) {
    alert(`Erro ao confirmar pagamento: ${err.message}`);
  }
}

// ─── Ver Detalhes ─────────────────────────────────────────────────────────────

function verDetalhes(idReserva) {
  const reserva = reservasCache.find(r => r.idReserva === idReserva);
  if (!reserva) return;

  const dataFormatada = reserva.dataHoraReserva
    ? new Date(reserva.dataHoraReserva).toLocaleString('pt-BR')
    : 'Não informada';

  const qtdTotal = (reserva.itens || []).reduce((acc, i) => acc + (i.quantProduto || 0), 0);
  const itensTexto = (reserva.itens || [])
    .map(i => `  • ${i.nomeProduto || 'Produto'} x${i.quantProduto} = R$ ${parseFloat(i.valor || 0).toFixed(2).replace('.', ',')}`)
    .join('\n') || '  (sem itens)';

  const statusRetirada = reserva.retirada ? reserva.retirada.statusRetirada : 'Não registrada';
  const statusPagamento = reserva.pagamento ? reserva.pagamento.statusPagamento : 'Não registrado';
  const formaPagamento = reserva.pagamento ? reserva.pagamento.formaPagamento : '—';
  const valorTotal = reserva.valorReserva != null
    ? `R$ ${parseFloat(reserva.valorReserva).toFixed(2).replace('.', ',')}`
    : '—';

  alert(`📋 DETALHES DA RESERVA

Código: ${reserva.codigoConfirmacao || '—'}
Evento: ${reserva.nomeEvento || '—'}
Data: ${dataFormatada}

CLIENTE:
Nome: ${reserva.nomeCliente || '—'}
CPF: ${reserva.cpfCliente || '—'}

ITENS (${qtdTotal} ${qtdTotal === 1 ? 'porção' : 'porções'}):
${itensTexto}

Valor Total: ${valorTotal}
Forma de Pagamento: ${formaPagamento}
Status Pagamento: ${statusPagamento}
Status Retirada: ${statusRetirada}
${reserva.observacoes ? `\nObservações:\n${reserva.observacoes}` : ''}`);
}

// ─── Estatísticas ─────────────────────────────────────────────────────────────

function atualizarEstatisticas(reservas) {
  const total = reservas.length;
  const qtdTotal = reservas.reduce((acc, r) =>
    acc + (r.itens || []).reduce((s, i) => s + (i.quantProduto || 0), 0), 0);
  const retiradas = reservas.filter(r => r.retirada && r.retirada.statusRetirada === 'retirado').length;
  const pagasCount = reservas.filter(r => r.pagamento && r.pagamento.statusPagamento === 'pago').length;

  const cards = document.querySelectorAll('.stat-card');
  if (cards[0]) cards[0].querySelector('.stat-value').textContent = total;
  if (cards[1]) cards[1].querySelector('.stat-subtitle').textContent = `${qtdTotal} porções reservadas`;
  if (cards[2]) cards[2].querySelector('.stat-value').textContent = retiradas;
  if (cards[3]) cards[3].querySelector('.stat-value').textContent = pagasCount;
}

// ─── Filtrar Tabela ───────────────────────────────────────────────────────────

function filtrarReservas() {
  const termoBusca1 = document.querySelectorAll('.search-input')[0]?.value.toLowerCase() || '';
  const termoBusca2 = document.querySelectorAll('.search-input')[1]?.value.toLowerCase() || '';
  const filtroStatus = document.querySelectorAll('.filter-select')[0]?.value || '';
  const filtroPagamento = document.querySelectorAll('.filter-select')[2]?.value || '';

  const linhas = document.querySelectorAll('#reservasTable tr[data-id]');

  linhas.forEach(linha => {
    const codigo = (linha.querySelector('td:nth-child(1)')?.textContent || '').toLowerCase();
    const nome = (linha.querySelector('td:nth-child(2)')?.textContent || '').toLowerCase();
    const cpf = (linha.querySelector('td:nth-child(3)')?.textContent || '').toLowerCase();
    const statusRetirada = linha.dataset.statusRetirada || '';
    const statusPagamento = linha.dataset.statusPagamento || '';

    const busca1Match = !termoBusca1 || nome.includes(termoBusca1) || cpf.includes(termoBusca1);
    const busca2Match = !termoBusca2 || codigo.includes(termoBusca2);

    const statusMatch = !filtroStatus || filtroStatus === 'Todos os Status' ||
      filtroStatus.toLowerCase() === statusRetirada.toLowerCase();

    const pagamentoMatch = !filtroPagamento || filtroPagamento === 'Todos os Pagamentos' ||
      (filtroPagamento === 'Confirmado' && statusPagamento === 'pago') ||
      (filtroPagamento === 'Pendente' && statusPagamento !== 'pago');

    linha.style.display = (busca1Match && busca2Match && statusMatch && pagamentoMatch) ? '' : 'none';
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusRetiradaTexto(status) {
  switch (status) {
    case 'retirado': return 'Retirado';
    case 'pendente': return 'Pendente';
    default: return 'Não registrada';
  }
}

function marcarMenuAtivo(pagina) {
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href')?.includes(pagina)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ─── Exportação CSV ───────────────────────────────────────────────────────────

function exportarCSV() {
  if (reservasCache.length === 0) {
    alert('Nenhuma reserva para exportar.');
    return;
  }

  const hoje = new Date().toISOString().split('T')[0];
  let csv = 'Código,Nome,CPF,Evento,Porções,Valor Total,Forma Pagamento,Status Pagamento,Status Retirada,Data Reserva\n';

  reservasCache.forEach(r => {
    const qtd = (r.itens || []).reduce((a, i) => a + (i.quantProduto || 0), 0);
    const valor = r.valorReserva != null ? parseFloat(r.valorReserva).toFixed(2) : '';
    const forma = r.pagamento ? r.pagamento.formaPagamento : '';
    const statPag = r.pagamento ? r.pagamento.statusPagamento : 'pendente';
    const statRet = r.retirada ? r.retirada.statusRetirada : 'pendente';
    const data = r.dataHoraReserva ? new Date(r.dataHoraReserva).toLocaleString('pt-BR') : '';

    csv += `"${r.codigoConfirmacao || ''}","${r.nomeCliente || ''}","${r.cpfCliente || ''}","${r.nomeEvento || ''}","${qtd}","${valor}","${forma}","${statPag}","${statRet}","${data}"\n`;
  });

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `reservas_talharim_${hoje}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert(`✅ Exportação concluída!\nArquivo: reservas_talharim_${hoje}.csv`);
}

function exportarExcel() {
  alert('A exportação para Excel será implementada em breve.\nPor enquanto, use a opção CSV que pode ser aberta no Excel.');
}