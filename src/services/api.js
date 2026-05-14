const BASE_URL = "http://localhost:8000/api";

let accessToken = null;
let refreshToken = null;

function authHeaders() {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
}

export function setTokens(tokens) {
  accessToken = tokens.access;
  refreshToken = tokens.refresh;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function loadTokensFromStorage() {
  const a = localStorage.getItem("accessToken");
  const r = localStorage.getItem("refreshToken");
  if (a && r) {
    accessToken = a;
    refreshToken = r;
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const data = await res.json();
  setTokens(data);
  return data;
}

// -------------------------
// EVENTOS
// -------------------------
export async function apiGetEventos() {
  const res = await fetch(`${BASE_URL}/eventos/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}

export async function apiGetEvento(id) {
  const res = await fetch(`${BASE_URL}/eventos/${id}/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}

// -------------------------
// INSCRIPCIONES
// -------------------------
export async function apiGetInscripcionesEvento(id) {
  const res = await fetch(`${BASE_URL}/eventos/${id}/inscripciones/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}

// -------------------------
// USUARIOS
// -------------------------
export async function apiGetUsuarios() {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}

// -------------------------
// CATEGORÍAS
// -------------------------
export async function apiGetCategorias() {
  const res = await fetch(`${BASE_URL}/categorias/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}

export async function apiGetMe() {
  const res = await fetch(`${BASE_URL}/usuarios/me/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return await res.json();
}
