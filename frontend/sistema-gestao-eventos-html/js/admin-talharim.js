document.addEventListener('DOMContentLoaded', function() {
  verificarAutenticacao();
  carregarReservas();
  marcarMenuAtivo('admin-talharim.html');
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

  if (reservas.length === 0) {
    table.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhuma reserva registrada</td></tr>';
    return;
  }

  table.innerHTML = reservas.map(r => `
    <tr>
      <td><strong>${r.codigo}</strong></td>
      <td>${r.nomeCompleto}</td>
      <td>${r.quantidade} porções</td>
      <td>${r.formaPagamento}</td>
      <td><span class="status-badge status-${r.status}">${r.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="verDetalhes('${r.codigo}')">Ver</button>
          <button class="btn-delete" onclick="deletarReserva('${r.codigo}')">Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function verDetalhes(codigo) {
  const reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
  const reserva = reservas.find(r => r.codigo === codigo);
  
  if (reserva) {
    alert(`Detalhes da Reserva:\n\nNome: ${reserva.nomeCompleto}\nEmail: ${reserva.email}\nTelefone: ${reserva.telefone}\nQuantidade: ${reserva.quantidade}\nPagamento: ${reserva.formaPagamento}\nStatus: ${reserva.status}`);
  }
}

function deletarReserva(codigo) {
  if (confirm('Tem certeza que deseja deletar esta reserva?')) {
    let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
    reservas = reservas.filter(r => r.codigo !== codigo);
    localStorage.setItem('talharimReservas', JSON.stringify(reservas));
    carregarReservas();
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
