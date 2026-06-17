/**
 * admin-login.js — Login do administrador via backend
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const usuario = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value;
      const btn = form.querySelector('button[type=submit]');

      // UI: desabilita botão durante a requisição
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Entrando...';
      }
      if (errorMessage) errorMessage.style.display = 'none';

      try {
        const data = await apiFetch('/admin/login', {
          method: 'POST',
          body: JSON.stringify({ usuario, senha }),
        });

        // Salva JWT e dados do admin
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsuario', data.usuario);
        localStorage.setItem('adminId', data.idAdmin);
        // Mantém 'adminLogado' para compatibilidade com verificações existentes
        localStorage.setItem('adminLogado', 'true');

        window.location.href = 'admin-talharim.html';

      } catch (err) {
        if (errorMessage) {
          errorMessage.textContent = 'Usuário ou senha incorretos!';
          errorMessage.style.display = 'block';
        }
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Entrar';
        }
      }
    });
  }
});

// ─── apiFetch inline ─────────────────────────────────────────────────────────

const API_BASE_URL_LOGIN = 'https://emptier-sanction-sequence.ngrok-free.dev/api';

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // <-- ADICIONE ESTA LINHA
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL_LOGIN}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = (data && (data.message || data.error)) || `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}
