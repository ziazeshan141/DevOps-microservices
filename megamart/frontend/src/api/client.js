const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const ACCESS_KEY = 'megamart.accessToken';
const REFRESH_KEY = 'megamart.refreshToken';

function url(path) {
  return `${API_BASE}${path}`;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return false;
  const response = await fetch(url('/api/v1/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    clearTokens();
    return false;
  }
  saveTokens(await response.json());
  return true;
}

export async function request(path, options = {}, retry = true) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(url(path), { ...options, headers });
  } catch {
    throw new Error('MegaMart API is unreachable. Start the API Gateway on port 3020.');
  }

  if (response.status === 401 && retry && !['/api/v1/auth/login','/api/v1/auth/register','/api/v1/auth/refresh','/api/v1/auth/logout'].includes(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(path, options, false);
  }

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export function put(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function remove(path) {
  return request(path, { method: 'DELETE' });
}
