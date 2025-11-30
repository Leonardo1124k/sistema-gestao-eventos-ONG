document.addEventListener('DOMContentLoaded', function() {
  console.log('Página de Datas do Bazar carregada');

  const dataCards = document.querySelectorAll('.data-card');
  dataCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});
