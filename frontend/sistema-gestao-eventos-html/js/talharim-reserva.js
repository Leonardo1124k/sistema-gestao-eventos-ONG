// Talharim Reserva Page Script

document.addEventListener('DOMContentLoaded', function() {
  console.log('Página de Reserva Talharim carregada');

  const form = document.getElementById('reservaForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Coletar dados do formulário
      const formData = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        quantidade: document.getElementById('quantidade').value,
        formaPagamento: document.getElementById('formaPagamento').value,
        observacoes: document.getElementById('observacoes').value,
        dataReserva: new Date().toISOString(),
        codigo: gerarCodigo(),
        status: 'pendente'
      };

      // Validar dados
      if (!validarFormulario(formData)) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Salvar no localStorage
      let reservas = JSON.parse(localStorage.getItem('talharimReservas')) || [];
      reservas.push(formData);
      localStorage.setItem('talharimReservas', JSON.stringify(reservas));

      // Salvar dados da reserva para exibir na confirmação
      localStorage.setItem('ultimaReserva', JSON.stringify(formData));

      // Redirecionar para confirmação
      window.location.href = 'talharim-confirmacao.html';
    });
  }

  // Formatar telefone
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

  // Validar quantidade mínima
  const quantidadeInput = document.getElementById('quantidade');
  if (quantidadeInput) {
    quantidadeInput.addEventListener('change', function(e) {
      if (parseInt(e.target.value) < 1) {
        e.target.value = 1;
      }
    });
  }
});

// Função para validar formulário
function validarFormulario(data) {
  return data.nomeCompleto && 
         data.email && 
         data.telefone && 
         data.quantidade && 
         data.formaPagamento;
}

// Função para gerar código único
function gerarCodigo() {
  return 'RES-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}
