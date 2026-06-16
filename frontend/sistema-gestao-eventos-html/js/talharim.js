// Talharim Page Script
// Atualizado para carregar informações reais da API do backend

const API_BASE_URL = 'https://emptier-sanction-sequence.ngrok-free.dev';

document.addEventListener('DOMContentLoaded', function() {
  console.log('Página Talharim carregada');

  // Adicionar event listeners aos botões
  const reservaBtn = document.querySelector('a[href="talharim-reserva.html"]');
  if (reservaBtn) {
    reservaBtn.addEventListener('click', function(e) {
      console.log('Navegando para formulário de reserva');
    });
  }

  // Smooth scroll para os cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Carregar dados reais da API
  carregarDadosEvento();
  carregarDadosProduto();
});

// Busca as informações do Evento
async function carregarDadosEvento() {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/abertos`);
    const eventos = await response.json();

    if (eventos && eventos.length > 0) {
      const evento = eventos[0]; // Pega o primeiro evento aberto

      // Título
      const tituloEl = document.getElementById('heroTitulo');
      if (tituloEl) tituloEl.textContent = `Evento ${evento.nomeEvento}`;

      // Local
      const localEl = document.getElementById('eventLocalInfo');
      if (localEl) localEl.textContent = evento.local || 'Sede da ONG';

      // Data e Horário
      if (evento.dataHoraEvento) {
        const dataObj = new Date(evento.dataHoraEvento);
        
        // Ex: Sábado, 30 de Novembro de 2025
        const opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dataTexto = dataObj.toLocaleDateString('pt-BR', opcoesData);
        // Capitaliza a primeira letra do dia da semana
        dataTexto = dataTexto.charAt(0).toUpperCase() + dataTexto.slice(1);
        
        const dataEl = document.getElementById('eventDataInfo');
        if (dataEl) dataEl.textContent = dataTexto;

        // Horário de retirada aproximado
        const hora = dataObj.getHours();
        const min = dataObj.getMinutes().toString().padStart(2, '0');
        const horarioFim = (hora + 3) > 23 ? 23 : (hora + 3); // Presumindo 3 horas de evento
        
        const horaEl = document.getElementById('eventHoraInfo');
        if (horaEl) horaEl.textContent = `${hora}h${min !== '00' ? min : ''} às ${horarioFim}h`;
      }
    } else {
      document.getElementById('eventDataInfo').textContent = 'Nenhum evento agendado';
      document.getElementById('eventHoraInfo').textContent = '—';
      document.getElementById('eventLocalInfo').textContent = '—';
    }
  } catch (err) {
    console.error('Erro ao buscar dados do evento:', err);
    document.getElementById('eventDataInfo').textContent = 'Em breve';
    document.getElementById('eventHoraInfo').textContent = 'A definir';
    document.getElementById('eventLocalInfo').textContent = 'Consulte o site';
  }
}

// Busca as informações do Produto (Preço)
async function carregarDadosProduto() {
  try {
    const response = await fetch(`${API_BASE_URL}/produtos`);
    const produtos = await response.json();

    if (produtos && produtos.length > 0) {
      // Procura algum produto com "talharim" no nome
      const produtoTalharim = produtos.find(p => 
        p.nomeProduto.toLowerCase().includes('talharim')
      );

      const valorEl = document.getElementById('produtoValorInfo');
      if (produtoTalharim && valorEl) {
        const precoFormatado = parseFloat(produtoTalharim.precoProduto).toFixed(2).replace('.', ',');
        valorEl.innerHTML = `Porção ${produtoTalharim.nomeProduto}: <strong>R$ ${precoFormatado}</strong>`;
      }
    }
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    const valorEl = document.getElementById('produtoValorInfo');
    if (valorEl) valorEl.textContent = 'Consulte os valores na reserva';
  }
}
