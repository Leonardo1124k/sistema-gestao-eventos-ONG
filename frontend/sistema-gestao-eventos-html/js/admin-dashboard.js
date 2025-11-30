document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  const adminLogado = localStorage.getItem('adminLogado');
  const adminUsuario = localStorage.getItem('adminUsuario');

  if (!adminLogado) {
    window.location.href = 'admin-login.html';
    return;
  }

  // Exibir nome do usuário
  const nomeUsuario = document.getElementById('nomeUsuario');
  if (nomeUsuario && adminUsuario) {
    nomeUsuario.textContent = adminUsuario.toUpperCase();
  }

  // Carregar dados
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

  // Atualizar contadores
  document.getElementById('totalReservas').textContent = reservas.length;
  document.getElementById('totalDoacoes').textContent = doacoes.length;
  document.getElementById('totalVoluntarios').textContent = voluntarios.length;

  // Carregar atividades recentes
  carregarAtividades(reservas, doacoes, voluntarios);

  // Marcar item ativo no menu
  const currentPage = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href').includes(currentPage)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
});

function carregarAtividades(reservas, doacoes, voluntarios) {
  const activityList = document.getElementById('activityList');
  const atividades = [];

  // Adicionar reservas
  reservas.forEach(r => {
    atividades.push({
      tipo: 'Reserva Talharim',
      descricao: `${r.nomeCompleto} reservou ${r.quantidade} porções`,
      data: new Date(r.dataReserva),
      icon: '🍝'
    });
  });

  // Adicionar doações
  doacoes.forEach(d => {
    atividades.push({
      tipo: 'Doação Bazar',
      descricao: `${d.nome} doou ${d.quantidade} itens`,
      data: new Date(d.dataDoacao),
      icon: '🛍️'
    });
  });

  // Adicionar voluntários
  voluntarios.forEach(v => {
    atividades.push({
      tipo: 'Voluntário',
      descricao: `${v.nome} se inscreveu como voluntário`,
      data: new Date(v.dataInscricao),
      icon: '👥'
    });
  });

  // Ordenar por data (mais recentes primeiro)
  atividades.sort((a, b) => b.data - a.data);

  // Exibir apenas as 10 mais recentes
  activityList.innerHTML = '';
  if (atividades.length === 0) {
    activityList.innerHTML = '<p class="empty-state">Nenhuma atividade registrada ainda</p>';
  } else {
    atividades.slice(0, 10).forEach(atividade => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <strong>${atividade.icon} ${atividade.tipo}</strong>
        <p>${atividade.descricao}</p>
        <p>${formatarData(atividade.data)}</p>
      `;
      activityList.appendChild(item);
    });
  }
}

function formatarData(data) {
  const hoje = new Date();
  const diferenca = hoje - data;
  const minutos = Math.floor(diferenca / 60000);
  const horas = Math.floor(diferenca / 3600000);
  const dias = Math.floor(diferenca / 86400000);

  if (minutos < 60) {
    return `há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  } else if (horas < 24) {
    return `há ${horas} hora${horas !== 1 ? 's' : ''}`;
  } else if (dias < 7) {
    return `há ${dias} dia${dias !== 1 ? 's' : ''}`;
  } else {
    return data.toLocaleDateString('pt-BR');
  }
}
