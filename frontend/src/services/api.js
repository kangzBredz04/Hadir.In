import {
  AUTH_UNAUTHORIZED_EVENT,
  tokenStorage,
} from '../utils/tokenStorage.js';

const API_URL = import.meta.env.VITE_API_URL;

function buildHeaders(headers, body, withAuth) {
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData) && body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (withAuth) {
    const token = tokenStorage.get();

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  return requestHeaders;
}

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;

  return response.json().catch(() => null);
}

export async function apiRequest(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error('Konfigurasi VITE_API_URL belum tersedia.');
  }

  const { auth = true, headers, body, ...fetchOptions } = options;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    body,
    headers: buildHeaders(headers, body, auth),
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(payload?.message || 'Terjadi kendala saat memproses permintaan.');
    error.status = response.status;
    error.data = payload?.data;
    error.payload = payload;

    if (response.status === 401 && auth) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    throw error;
  }
  console.log(payload);

  return payload;
}

export { API_URL };
