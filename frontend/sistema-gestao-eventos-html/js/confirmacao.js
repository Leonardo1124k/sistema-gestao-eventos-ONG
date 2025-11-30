// Confirmacao Page Script

document.addEventListener('DOMContentLoaded', function() {
  console.log('Página de Confirmação carregada');

  // Recuperar dados da última reserva/doação
  const ultimaReserva = localStorage.getItem('ultimaReserva');
  
  if (ultimaReserva) {
    const dados = JSON.parse(ultimaReserva);
    
    // Preencher os dados na página
    const codigoElement = document.getElementById('codigoReserva');
    const nomeElement = document.getElementById('nomeReserva');
    const quantidadeElement = document.getElementById('quantidadeReserva');
    const valorElement = document.getElementById('valorReserva');

    if (codigoElement) codigoElement.textContent = dados.codigo;
    if (nomeElement) nomeElement.textContent = dados.nomeCompleto || dados.nome || '-';
    
    if (quantidadeElement) {
      if (dados.quantidade) {
        quantidadeElement.textContent = dados.quantidade + ' porções';
      } else if (dados.tipoDoacao) {
        quantidadeElement.textContent = dados.tipoDoacao;
      }
    }
    
    if (valorElement && dados.quantidade) {
      const valor = parseInt(dados.quantidade) * 25;
      valorElement.textContent = 'R$ ' + valor.toFixed(2).replace('.', ',');
    }
  }

  // Adicionar animação ao ícone de sucesso
  const successIcon = document.querySelector('.success-icon');
  if (successIcon) {
    successIcon.style.animation = 'pulse 2s infinite';
  }
});

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;
document.head.appendChild(style);
