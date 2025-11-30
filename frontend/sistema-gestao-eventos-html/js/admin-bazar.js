document.addEventListener('DOMContentLoaded', function() {
  verificarAutenticacao();
  carregarDoacoes();
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

function carregarDoacoes() {
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  const table = document.getElementById('doacoesTable');

  if (doacoes.length === 0) {
    table.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhuma doação registrada</td></tr>';
    return;
  }

  table.innerHTML = doacoes.map(d => `
    <tr>
      <td><strong>${d.codigo}</strong></td>
      <td>${d.nome}</td>
      <td>${d.tipoDoacao}</td>
      <td>${d.quantidade} itens</td>
      <td><span class="status-badge status-${d.status}">${d.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="verDetalhes('${d.codigo}')">Ver</button>
          <button class="btn-delete" onclick="deletarDoacao('${d.codigo}')">Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function verDetalhes(codigo) {
  const doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
  const doacao = doacoes.find(d => d.codigo === codigo);
  
  if (doacao) {
    alert(`Detalhes da Doação:\n\nNome: ${doacao.nome}\nEmail: ${doacao.email}\nTelefone: ${doacao.telefone}\nTipo: ${doacao.tipoDoacao}\nQuantidade: ${doacao.quantidade}\nDescrição: ${doacao.descricao || 'N/A'}\nStatus: ${doacao.status}`);
  }
}

function deletarDoacao(codigo) {
  if (confirm('Tem certeza que deseja deletar esta doação?')) {
    let doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
    doacoes = doacoes.filter(d => d.codigo !== codigo);
    localStorage.setItem('bazarDoacoes', JSON.stringify(doacoes));
    carregarDoacoes();
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
