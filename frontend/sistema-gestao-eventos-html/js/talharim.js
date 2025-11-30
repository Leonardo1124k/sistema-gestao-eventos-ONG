// Talharim Page Script

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
});
