// Index Page Script

document.addEventListener('DOMContentLoaded', function() {
  console.log('Página inicial carregada');

  // Adicionar efeito aos cards de eventos
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});
