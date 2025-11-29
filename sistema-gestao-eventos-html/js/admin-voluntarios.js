document.addEventListener('DOMContentLoaded', function() {
  verificarAutenticacao();
  carregarVoluntarios();
  marcarMenuAtivo('admin-voluntarios.html');
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

function carregarVoluntarios() {
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
  const table = document.getElementById('voluntariosTable');

  if (voluntarios.length === 0) {
    table.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum voluntário registrado</td></tr>';
    return;
  }

  table.innerHTML = voluntarios.map(v => `
    <tr>
      <td><strong>${v.codigo}</strong></td>
      <td>${v.nome}</td>
      <td>${v.areaInteresse}</td>
      <td>${v.disponibilidade}</td>
      <td><span class="status-badge status-${v.status}">${v.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="verDetalhes('${v.codigo}')">Ver</button>
          <button class="btn-delete" onclick="deletarVoluntario('${v.codigo}')">Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function verDetalhes(codigo) {
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
  const voluntario = voluntarios.find(v => v.codigo === codigo);
  
  if (voluntario) {
    alert(`Detalhes do Voluntário:\n\nNome: ${voluntario.nome}\nEmail: ${voluntario.email}\nTelefone: ${voluntario.telefone}\nData Nascimento: ${voluntario.dataNascimento}\nÁrea: ${voluntario.areaInteresse}\nDisponibilidade: ${voluntario.disponibilidade}\nExperiência: ${voluntario.experiencia || 'N/A'}\nStatus: ${voluntario.status}`);
  }
}

function deletarVoluntario(codigo) {
  if (confirm('Tem certeza que deseja deletar este voluntário?')) {
    let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
    voluntarios = voluntarios.filter(v => v.codigo !== codigo);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    carregarVoluntarios();
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
