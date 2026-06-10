/**
 * api.js — Módulo central de comunicação com o backend
 * Base URL: http://localhost:8080/api
 */

const API_BASE_URL = 'http://localhost:8080/api';

// ─── JWT / Auth ────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('adminToken');
}

function setToken(token) {
  localStorage.setItem('adminToken', token);
}

function clearToken() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsuario');
  localStorage.removeItem('adminId');
}

/**
 * Wrapper de fetch com suporte a JWT e tratamento de erros centralizado.
 * Retorna o JSON parseado, ou lança um Error com a mensagem do backend.
 */
async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Respostas sem corpo (204 No Content)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Tenta pegar mensagem do backend (GlobalExceptionHandler)
    const msg =
      (data && (data.message || data.error || JSON.stringify(data))) ||
      `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

// ─── Admin / Auth ──────────────────────────────────────────────────────────────

async function loginAdmin(usuario, senha) {
  const data = await apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, senha }),
  });
  // Salva token e dados do admin no localStorage
  setToken(data.token);
  localStorage.setItem('adminUsuario', data.usuario);
  localStorage.setItem('adminId', data.idAdmin);
  return data;
}

// ─── Clientes ──────────────────────────────────────────────────────────────────

async function buscarClientePorCpf(cpf) {
  return apiFetch(`/clientes/cpf/${encodeURIComponent(cpf)}`);
}

async function cadastrarCliente(clienteDTO) {
  return apiFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify(clienteDTO),
  });
}

// ─── Eventos ───────────────────────────────────────────────────────────────────

async function listarEventosAbertos() {
  return apiFetch('/eventos/abertos');
}

// ─── Produtos ──────────────────────────────────────────────────────────────────

async function listarProdutos() {
  return apiFetch('/produtos');
}

// ─── Reservas ─────────────────────────────────────────────────────────────────

async function criarReserva(reservaDTO) {
  return apiFetch('/reservas', {
    method: 'POST',
    body: JSON.stringify(reservaDTO),
  });
}

async function listarReservas() {
  return apiFetch('/reservas');
}

async function buscarReservaPorCodigo(codigo) {
  return apiFetch(`/reservas/codigo/${encodeURIComponent(codigo)}`);
}

// ─── Pagamentos ────────────────────────────────────────────────────────────────

async function registrarPagamento(pagamentoDTO) {
  return apiFetch('/pagamentos', {
    method: 'POST',
    body: JSON.stringify(pagamentoDTO),
  });
}

async function confirmarPagamento(idPagamento) {
  return apiFetch(`/pagamentos/${idPagamento}/confirmar`, {
    method: 'PATCH',
  });
}

async function buscarPagamentoPorReserva(idReserva) {
  return apiFetch(`/pagamentos/reserva/${idReserva}`);
}

// ─── Retiradas ─────────────────────────────────────────────────────────────────

async function registrarRetirada(idReserva) {
  return apiFetch(`/retiradas/reserva/${idReserva}`, {
    method: 'POST',
  });
}

async function confirmarRetirada(idRetirada) {
  return apiFetch(`/retiradas/${idRetirada}/confirmar`, {
    method: 'PATCH',
  });
}

async function buscarRetiradaPorReserva(idReserva) {
  return apiFetch(`/retiradas/reserva/${idReserva}`);
}
