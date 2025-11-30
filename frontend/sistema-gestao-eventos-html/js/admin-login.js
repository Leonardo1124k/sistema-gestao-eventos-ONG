document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senha').value;

      // Credenciais de teste
      if (usuario === 'ong' && senha === 'admin123') {
        // Salvar sessão
        localStorage.setItem('adminLogado', 'true');
        localStorage.setItem('adminUsuario', usuario);
        
        // Redirecionar para dashboard
        window.location.href = 'admin-talharim.html';
      } else {
        // Mostrar erro
        errorMessage.textContent = 'Usuário ou senha incorretos!';
        errorMessage.style.display = 'block';
        
        // Limpar campos
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';
      }
    });
  }
});
