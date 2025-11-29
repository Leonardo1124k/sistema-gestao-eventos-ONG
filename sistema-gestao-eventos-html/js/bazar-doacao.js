document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('doacaoForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        tipoDoacao: document.getElementById('tipoDoacao').value,
        quantidade: document.getElementById('quantidade').value,
        descricao: document.getElementById('descricao').value,
        dataDoacao: new Date().toISOString(),
        codigo: gerarCodigo(),
        status: 'pendente'
      };

      if (!validarFormulario(formData)) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      let doacoes = JSON.parse(localStorage.getItem('bazarDoacoes')) || [];
      doacoes.push(formData);
      localStorage.setItem('bazarDoacoes', JSON.stringify(doacoes));
      localStorage.setItem('ultimaReserva', JSON.stringify(formData));

      window.location.href = 'bazar-confirmacao.html';
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
  return data.nome && data.email && data.telefone && data.endereco && data.tipoDoacao && data.quantidade;
}

function gerarCodigo() {
  return 'DOA-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}
