document.addEventListener('DOMContentLoaded', function() {
  verificarAutenticacao();
  carregarReservas();
  marcarMenuAtivo('admin-talharim.html');
  atualizarEstatisticas();
  
  // Adicionar event listeners para filtros
  document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', filtrarReservas);
  });
  
  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', filtrarReservas);
  });
  
  // Adicionar event listeners para exportação
  document.querySelectorAll('.btn-export').forEach((btn, index) => {
    btn.addEventListener('click', function() {
      if (index === 0) exportarCSV();
      else exportarExcel();
    });
  });
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

function carregarReservas() {
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  const table = document.getElementById('reservasTable');
  
  // Ordenar por data mais recente primeiro
  reservas.sort((a, b) => new Date(b.dataReserva || 0) - new Date(a.dataReserva || 0));

  if (reservas.length === 0) {
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
      </tr>
    `;
    atualizarEstatisticas();
    return;
  }

  table.innerHTML = reservas.map(r => {
    // Determinar o texto correto para a quantidade
    const quantidade = parseInt(r.quantidade) || 1;
    let textoQuantidade;
    
    if (quantidade === 1) {
      textoQuantidade = `${quantidade} porção`;
    } else {
      textoQuantidade = `${quantidade} porções`;
    }
    
    return `
    <tr data-status="${r.status || 'pendente'}" data-pagamento="${r.statusPagamento || 'pendente'}">
      <td><strong>${r.codigo}</strong></td>
      <td>${r.nomeCompleto}</td>
      <td>${r.email}</td>
      <td>${r.telefone}</td>
      <td>${textoQuantidade}</td>
      <td>
        <span class="status-badge status-${r.status === 'retirado' ? 'confirmado' : r.status || 'pendente'}">
          ${getStatusTexto(r.status)}
        </span>
      </td>
      <td>
        <span class="status-badge status-${r.statusPagamento === 'confirmado' ? 'confirmado' : 'pendente'}">
          ${r.statusPagamento === 'confirmado' ? 'Confirmado' : 'Pendente'}
        </span>
      </td>
      <td>
        <div class="action-buttons-single-row">
          <!-- Botão Confirmar Retirada (Check) -->
          <button class="btn-action btn-confirm-retirada" onclick="confirmarRetirada('${r.codigo}')" title="Confirmar Retirada" ${(r.status === 'retirado' || r.status === 'cancelado') ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Botão Confirmar Pagamento (Sifrão) -->
          <button class="btn-action btn-confirm-pagamento" onclick="confirmarPagamento('${r.codigo}')" title="Confirmar Pagamento" ${(r.statusPagamento === 'confirmado' || r.status === 'cancelado') ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Botão Cancelar Reserva (X) -->
          <button class="btn-action btn-cancel-reserva" onclick="cancelarReserva('${r.codigo}')" title="Cancelar Reserva" ${r.status === 'cancelado' || r.status === 'retirado' ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Botão Ver Detalhes (Olho) -->
          <button class="btn-action btn-view-details" onclick="verDetalhes('${r.codigo}')" title="Ver Detalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Botão Excluir (Lixeira) -->
          <button class="btn-action btn-delete-reserva" onclick="deletarReserva('${r.codigo}')" title="Excluir Reserva">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join('');
  
  atualizarEstatisticas();
}

function getStatusTexto(status) {
  switch(status) {
    case 'retirado': return 'Retirado';
    case 'confirmado': return 'Confirmado';
    case 'cancelado': return 'Cancelado';
    default: return 'Pendente';
  }
}

function atualizarEstatisticas() {
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  
  // Total de reservas
  const totalReservas = reservas.length;
  document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = totalReservas;
  
  // Capacidade
  const capacidadeTotal = 200;
  const totalPorcoes = reservas.reduce((total, r) => {
    const qtd = parseInt(r.quantidade) || 1;
    return total + (r.status !== 'cancelado' ? qtd : 0);
  }, 0);
  const percentualOcupado = Math.round((totalPorcoes / capacidadeTotal) * 100);
  document.querySelector('.stat-card:nth-child(2) .stat-subtitle').textContent = `${percentualOcupado}% ocupado`;
  
  // Reservas retiradas
  const reservasRetiradas = reservas.filter(r => r.status === 'retirado').length;
  document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = reservasRetiradas;
  
  // Pagamentos confirmados
  const pagamentosConfirmados = reservas.filter(r => r.statusPagamento === 'confirmado').length;
  document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = pagamentosConfirmados;
}

function verDetalhes(codigo) {
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  const reserva = reservas.find(r => r.codigo === codigo);
  
  if (reserva) {
    const dataFormatada = reserva.dataReserva ? 
      new Date(reserva.dataReserva).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Data não informada';
    
    const statusRetirada = getStatusTexto(reserva.status);
    const statusPagamento = reserva.statusPagamento === 'confirmado' ? 'Confirmado' : 'Pendente';
    
    // Determinar o texto correto para a quantidade
    const quantidade = parseInt(reserva.quantidade) || 1;
    const textoQuantidade = quantidade === 1 ? `${quantidade} porção` : `${quantidade} porções`;
    
    let detalhes = `📋 DETALHES DA RESERVA\n\n`;
    detalhes += `Código: ${reserva.codigo}\n`;
    detalhes += `Nome: ${reserva.nomeCompleto}\n`;
    detalhes += `Email: ${reserva.email}\n`;
    detalhes += `Telefone: ${reserva.telefone}\n`;
    detalhes += `Quantidade: ${textoQuantidade}\n`;
    detalhes += `Forma de Pagamento: ${reserva.formaPagamento || 'Não informada'}\n`;
    detalhes += `Status Retirada: ${statusRetirada}\n`;
    detalhes += `Status Pagamento: ${statusPagamento}\n`;
    detalhes += `Data da Reserva: ${dataFormatada}\n`;
    
    if (reserva.observacoes) {
      detalhes += `\nObservações:\n${reserva.observacoes}\n`;
    }
    
    alert(detalhes);
  }
}

function confirmarRetirada(codigo) {
  if (confirm('✅ Confirmar retirada desta reserva?\n\nApós confirmar, a retirada não poderá ser desfeita.')) {
    let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
    const index = reservas.findIndex(r => r.codigo === codigo);
    
    if (index !== -1) {
      reservas[index].status = 'retirado';
      reservas[index].dataRetirada = new Date().toISOString();
      localStorage.setItem('talharimReservas', JSON.stringify(reservas));
      
      alert(`✅ Retirada confirmada para a reserva ${codigo}!`);
      carregarReservas();
    }
  }
}

function confirmarPagamento(codigo) {
  if (confirm('💰 Confirmar pagamento desta reserva?\n\nEsta ação marcará o pagamento como confirmado.')) {
    let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
    const index = reservas.findIndex(r => r.codigo === codigo);
    
    if (index !== -1) {
      reservas[index].statusPagamento = 'confirmado';
      reservas[index].dataConfirmacaoPagamento = new Date().toISOString();
      localStorage.setItem('talharimReservas', JSON.stringify(reservas));
      
      alert(`✅ Pagamento confirmado para a reserva ${codigo}!`);
      carregarReservas();
    }
  }
}

function cancelarReserva(codigo) {
  if (confirm('❌ Cancelar esta reserva?\n\nEsta ação não pode ser desfeita. A reserva será marcada como cancelada.')) {
    let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
    const index = reservas.findIndex(r => r.codigo === codigo);
    
    if (index !== -1) {
      reservas[index].status = 'cancelado';
      reservas[index].dataCancelamento = new Date().toISOString();
      localStorage.setItem('talharimReservas', JSON.stringify(reservas));
      
      alert(`❌ Reserva ${codigo} cancelada com sucesso!`);
      carregarReservas();
    }
  }
}

function deletarReserva(codigo) {
  if (confirm('⚠️ ATENÇÃO!\n\nTem certeza que deseja EXCLUIR PERMANENTEMENTE esta reserva?\n\nEsta ação NÃO PODE ser desfeita e todos os dados serão perdidos.')) {
    let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
    const reserva = reservas.find(r => r.codigo === codigo);
    
    if (reserva) {
      reservas = reservas.filter(r => r.codigo !== codigo);
      localStorage.setItem('talharimReservas', JSON.stringify(reservas));
      
      alert(`🗑️ Reserva ${codigo} excluída permanentemente!`);
      carregarReservas();
    }
  }
}

function filtrarReservas() {
  const termoBusca1 = document.querySelectorAll('.search-input')[0]?.value.toLowerCase() || '';
  const termoBusca2 = document.querySelectorAll('.search-input')[1]?.value.toLowerCase() || '';
  const filtroStatus = document.querySelectorAll('.filter-select')[0]?.value;
  const filtroPagamento = document.querySelectorAll('.filter-select')[2]?.value;
  
  const linhas = document.querySelectorAll('#reservasTable tr');
  let linhasVisiveis = 0;
  
  linhas.forEach(linha => {
    if (linha.classList.contains('empty-state')) {
      return;
    }
    
    const codigo = linha.querySelector('td:nth-child(1)').textContent.toLowerCase();
    const nome = linha.querySelector('td:nth-child(2)').textContent.toLowerCase();
    const email = linha.querySelector('td:nth-child(3)').textContent.toLowerCase();
    const telefone = linha.querySelector('td:nth-child(4)').textContent.toLowerCase();
    const status = linha.dataset.status;
    const pagamento = linha.dataset.pagamento;
    
    const busca1Match = !termoBusca1 || 
      nome.includes(termoBusca1) || 
      email.includes(termoBusca1) || 
      telefone.includes(termoBusca1);
    
    const busca2Match = !termoBusca2 || codigo.includes(termoBusca2);
    
    const statusMatch = !filtroStatus || filtroStatus === 'Todos os Status' || 
      (filtroStatus === 'Confirmado' && status === 'confirmado') ||
      (filtroStatus === 'Pendente' && status === 'pendente') ||
      (filtroStatus === 'Cancelado' && status === 'cancelado') ||
      (filtroStatus === 'Retirado' && status === 'retirado');
    
    const pagamentoMatch = !filtroPagamento || filtroPagamento === 'Todos os Pagamentos' ||
      (filtroPagamento === 'Confirmado' && pagamento === 'confirmado') ||
      (filtroPagamento === 'Pendente' && pagamento === 'pendente');
    
    if (busca1Match && busca2Match && statusMatch && pagamentoMatch) {
      linha.style.display = '';
      linhasVisiveis++;
    } else {
      linha.style.display = 'none';
    }
  });
  
  const emptyRow = document.querySelector('.empty-state');
  if (emptyRow) {
    emptyRow.style.display = linhasVisiveis === 0 ? '' : 'none';
  }
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

function exportarCSV() {
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  if (reservas.length === 0) {
    alert('Nenhuma reserva para exportar.');
    return;
  }
  
  const hoje = new Date().toISOString().split('T')[0];
  let csv = 'Código,Nome,Email,Telefone,Quantidade,Forma Pagamento,Status Retirada,Status Pagamento,Data Reserva,Data Retirada,Data Pagamento\n';
  
  reservas.forEach(r => {
    const dataReserva = r.dataReserva ? formatarDataCSV(r.dataReserva) : '';
    const dataRetirada = r.dataRetirada ? formatarDataCSV(r.dataRetirada) : '';
    const dataPagamento = r.dataConfirmacaoPagamento ? formatarDataCSV(r.dataConfirmacaoPagamento) : '';
    
    csv += `"${r.codigo}","${r.nomeCompleto}","${r.email}","${r.telefone}","${r.quantidade}","${r.formaPagamento || ''}","${getStatusTexto(r.status)}","${r.statusPagamento === 'confirmado' ? 'Confirmado' : 'Pendente'}","${dataReserva}","${dataRetirada}","${dataPagamento}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
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

function formatarDataCSV(dataString) {
  if (!dataString) return '';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
}