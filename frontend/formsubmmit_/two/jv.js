document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const nome = urlParams.get('fullName') || 'Doador';
    let valor = urlParams.get('donationValue') || '0.00';

    // Converte 50.00 → 50,00
    valor = parseFloat(valor.replace(',', '.')) || 0;
    valor = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // Data atual
    const data = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // Atualiza a tela
    document.getElementById('donationValue').textContent = `Valor: R$ ${valor}`;
    document.getElementById('donationDate').textContent = `Data: ${data}`;

    // Mensagem personalizada
    if (nome !== 'Doador') {
        document.querySelector('.thank-you-message').innerHTML = 
            `<strong>${nome}</strong>, agradecemos sua doação!<br>Sua contribuição ajuda famílias a terem moradias dignas.`;
    }
});