document.addEventListener('DOMContentLoaded', function() {
  verificarAutenticacao();
  carregarEstatisticas();
  carregarDoacoes();
  configurarFiltros();
  marcarMenuAtivo('admin-bazar.html');
});

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

function carregarEstatisticas() {
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  
  const totalDoacoes = doacoes.length;
  const totalPendentes = doacoes.filter(d => d.status === 'pendente').length;
  const totalRecebidas = doacoes.filter(d => d.status === 'recebida').length;

  document.getElementById('totalDoacoes').textContent = totalDoacoes;
  document.getElementById('totalPendentes').textContent = totalPendentes;
  document.getElementById('totalRecebidas').textContent = totalRecebidas;
}

function carregarDoacoes(filtros = {}) {
  let doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  const table = document.getElementById('doacoesTable');

  // Aplicar filtros
  if (filtros.busca) {
    const busca = filtros.busca.toLowerCase();
    doacoes = doacoes.filter(d => 
      d.nome.toLowerCase().includes(busca) ||
      d.email.toLowerCase().includes(busca) ||
      d.telefone.toLowerCase().includes(busca)
    );
  }

  if (filtros.status) {
    doacoes = doacoes.filter(d => d.status === filtros.status);
  }

  if (doacoes.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto 1rem; display: block; opacity: 0.3;">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Nenhuma doação encontrada
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = doacoes.map(d => `
    <tr>
      <td><strong>${d.codigo}</strong></td>
      <td>${d.nome}</td>
      <td>${d.email}</td>
      <td>${d.telefone}</td>
      <td>${d.tipoDoacao}</td>
      <td>${d.quantidade}</td>
      <td><span class="status-badge status-${d.status}">${capitalizar(d.status)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="verDetalhes('${d.codigo}')">Ver</button>
          <button class="btn-delete" onclick="deletarDoacao('${d.codigo}')">Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function configurarFiltros() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');

  searchInput.addEventListener('input', aplicarFiltros);
  statusFilter.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
  const busca = document.getElementById('searchInput').value;
  const status = document.getElementById('statusFilter').value;

  const filtros = {};
  if (busca) filtros.busca = busca;
  if (status) filtros.status = status;

  carregarDoacoes(filtros);
}

function verDetalhes(codigo) {
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  const doacao = doacoes.find(d => d.codigo === codigo);
  
  if (doacao) {
    const detalhes = `
═══════════════════════════════════
      DETALHES DA DOAÇÃO
═══════════════════════════════════

CÓDIGO: ${doacao.codigo}

DADOS DO DOADOR:
Nome: ${doacao.nome}
Email: ${doacao.email}
Telefone: ${doacao.telefone}

INFORMAÇÕES DA DOAÇÃO:
Tipo de Item: ${doacao.tipoDoacao}
Quantidade: ${doacao.quantidade}
Descrição: ${doacao.descricao || 'Não informada'}

STATUS: ${capitalizar(doacao.status)}

Data de Registro: ${doacao.dataRegistro || 'Não disponível'}
═══════════════════════════════════
    `;
    alert(detalhes);
  }
}

function deletarDoacao(codigo) {
  if (confirm('Tem certeza que deseja deletar esta doação?\n\nEsta ação não pode ser desfeita.')) {
    let doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
    doacoes = doacoes.filter(d => d.codigo !== codigo);
    localStorage.setItem('bazarDoacoes', JSON.stringify(doacoes));
    
    carregarEstatisticas();
    aplicarFiltros();
  }
}

function exportarCSV() {
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  
  if (doacoes.length === 0) {
    alert('Não há doações para exportar.');
    return;
  }

  // Cabeçalhos do CSV
  const headers = ['Código', 'Nome', 'Email', 'Contato', 'Tipo de Item', 'Quantidade', 'Status', 'Descrição'];
  
  // Linhas do CSV
  const rows = doacoes.map(d => [
    d.codigo,
    d.nome,
    d.email,
    d.telefone,
    d.tipoDoacao,
    d.quantidade,
    capitalizar(d.status),
    d.descricao || ''
  ]);

  // Criar conteúdo CSV
  let csvContent = '\uFEFF'; // BOM para UTF-8
  csvContent += headers.join(',') + '\n';
  
  rows.forEach(row => {
    const escapedRow = row.map(field => {
      // Escapar aspas e adicionar aspas se contiver vírgula ou quebra de linha
      const fieldStr = String(field);
      if (fieldStr.includes(',') || fieldStr.includes('\n') || fieldStr.includes('"')) {
        return '"' + fieldStr.replace(/"/g, '""') + '"';
      }
      return fieldStr;
    });
    csvContent += escapedRow.join(',') + '\n';
  });

  // Criar blob e download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const dataAtual = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `doacoes-bazar-${dataAtual}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function marcarMenuAtivo(pagina) {
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href').includes(pagina)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
