/**
 * confirmacao.js — Exibe os detalhes da reserva criada no backend
 */

document.addEventListener('DOMContentLoaded', function () {
  const dados = JSON.parse(localStorage.getItem('ultimaReserva') || 'null');

  if (!dados) {
    // Sem dados — exibe mensagem genérica e não quebra a página
    return;
  }

  // Código de confirmação (vindo do backend)
  const codigoEl = document.getElementById('codigoReserva');
  if (codigoEl) {
    codigoEl.textContent = dados.codigo || '—';
  }

  // Nome
  const nomeEl = document.getElementById('nomeReserva');
  if (nomeEl) {
    nomeEl.textContent = dados.nomeCompleto || dados.nome || '—';
  }

  // Quantidade
  const qtdEl = document.getElementById('quantidadeReserva');
  if (qtdEl) {
    const qtd = parseInt(dados.quantidade) || 1;
    qtdEl.textContent = qtd === 1 ? `${qtd} porção` : `${qtd} porções`;
  }

  // Valor total (calculado no backend: precoProduto × quantidade)
  const valorEl = document.getElementById('valorReserva');
  if (valorEl) {
    if (dados.valorTotal != null) {
      valorEl.textContent = `R$ ${parseFloat(dados.valorTotal).toFixed(2).replace('.', ',')}`;
    } else if (dados.quantidade && dados.precoProduto) {
      const valor = parseInt(dados.quantidade) * parseFloat(dados.precoProduto);
      valorEl.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }
  }

  // Animação no ícone de sucesso
  const successIcon = document.querySelector('.success-icon');
  if (successIcon) {
    successIcon.style.animation = 'pulse 2s infinite';
  }
});

// CSS da animação
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);
