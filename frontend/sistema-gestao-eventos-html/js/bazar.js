// Bazar Page Script

document.addEventListener('DOMContentLoaded', function() {
  console.log('Página Bazar carregada');

  // Adicionar efeito aos cards
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
