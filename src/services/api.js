const BASE_URL = "http://localhost:8000/api";

let accessToken = null;
let refreshToken = null;

// -------------------------
// TOKENS
// -------------------------

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

// -------------------------
// FETCH CENTRALIZADO
// -------------------------

function refreshAccessToken() {
  if (!refreshToken) {
    return Promise.reject("No hay refresh token disponible");
  }

  return fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      clearTokens();
      return Promise.reject("No se pudo renovar la sesión");
    })
    .then((data) => {
      accessToken = data.access;
      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    });
}

function parseResponse(response) {
  if (response.status === 204) {
    return true;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json().then((data) => {
      if (response.ok) {
        return data;
      }

      return Promise.reject(JSON.stringify(data));
    });
  }

  return response.text().then((text) => {
    console.error("Respuesta no JSON recibida:", text);

    if (response.ok) {
      return text;
    }

    return Promise.reject(
      `El servidor devolvió una respuesta no JSON. Código HTTP: ${response.status}`
    );
  });
}

function apiFetch(endpoint, options = {}, requiresAuth = false) {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(requiresAuth ? authHeaders() : {}),
      ...(options.headers || {}),
    },
  };

  return fetch(`${BASE_URL}${endpoint}`, config).then((response) => {
    if (response.status === 401 && requiresAuth && refreshToken) {
      return refreshAccessToken()
        .then(() => {
          const retryConfig = {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
              ...(options.headers || {}),
            },
          };

          return fetch(`${BASE_URL}${endpoint}`, retryConfig);
        })
        .then(parseResponse)
        .catch((error) => {
          clearTokens();
          return Promise.reject(error);
        });
    }

    return parseResponse(response);
  });
}

// -------------------------
// LOGIN
// -------------------------

export function login(username, password) {
  return apiFetch("/token/", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((data) => {
      setTokens(data);
      return data;
    })
    .catch((error) => {
      console.error("Error en login:", error);
      return Promise.reject("No se pudo iniciar sesión. Revisa usuario, contraseña o backend.");
    });
}

// -------------------------
// EVENTOS
// -------------------------

export function apiGetEventos() {
  return apiFetch("/eventos/");
}

export function apiGetEvento(id) {
  return apiFetch(`/eventos/${id}/`);
}

export function apiCreateEvento(data) {
  return apiFetch(
    "/eventos/",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );
}

export function apiUpdateEvento(id, data) {
  return apiFetch(
    `/eventos/${id}/`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true
  );
}

export function apiDeleteEvento(id) {
  return apiFetch(
    `/eventos/${id}/`,
    {
      method: "DELETE",
    },
    true
  );
}

// -------------------------
// INSCRIPCIONES
// -------------------------

export function apiGetInscripcionesEvento(id) {
  return apiFetch(`/eventos/${id}/inscripciones/`);
}

export function apiCreateInscripcionEvento(eventoId, data) {
  return apiFetch(
    `/eventos/${eventoId}/inscripciones/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );
}

export function apiCancelarInscripcion(inscripcionId) {
  return apiFetch(
    `/inscripciones/${inscripcionId}/cancelar/`,
    {
      method: "PUT",
    },
    true
  );
}

export function apiToggleAsistenciaInscripcion(inscripcionId) {
  return apiFetch(
    `/inscripciones/${inscripcionId}/asistencia/`,
    {
      method: "PUT",
    },
    true
  );
}

// -------------------------
// USUARIOS
// -------------------------

export function apiGetUsuarios() {
  return apiFetch("/usuarios/");
}

export function apiCreateUsuario(data) {
  return apiFetch(
    "/usuarios/",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );
}

export function apiUpdateUsuario(dni, data) {
  return apiFetch(
    `/usuarios/${dni}/`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true
  );
}

export function apiDeleteUsuario(dni) {
  return apiFetch(
    `/usuarios/${dni}/`,
    {
      method: "DELETE",
    },
    true
  );
}

// -------------------------
// CATEGORÍAS
// -------------------------

export function apiGetCategorias() {
  return apiFetch("/categorias/");
}

// -------------------------
// USUARIO ACTUAL
// -------------------------

export function apiGetMe() {
  return apiFetch("/usuarios/me/", {}, true);
}
