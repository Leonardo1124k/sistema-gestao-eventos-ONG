document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('voluntarioForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        areaInteresse: document.getElementById('areaInteresse').value,
        disponibilidade: document.getElementById('disponibilidade').value,
        experiencia: document.getElementById('experiencia').value,
        dataInscricao: new Date().toISOString(),
        codigo: gerarCodigo(),
        status: 'pendente'
      };

      if (!validarFormulario(formData)) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
      voluntarios.push(formData);
      localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
      localStorage.setItem('ultimaReserva', JSON.stringify(formData));

      window.location.href = 'talharim-confirmacao.html';
    });
  }

  const telefonInput = document.getElementById('telefone');
  if (telefonInput) {
    telefonInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      e.target.value = value;
    });
  }
});

function validarFormulario(data) {
  return data.nome && data.email && data.telefone && data.dataNascimento && data.areaInteresse && data.disponibilidade;
}

function gerarCodigo() {
  return 'VOL-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}
