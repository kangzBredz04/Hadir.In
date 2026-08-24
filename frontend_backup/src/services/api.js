/**
 * Lapisan API paling dasar: satu tempat untuk base URL, header, auth token,
 * dan parsing response. Semua service (auth.service.js, dst) memanggil
 * `api.get/post/put/patch/delete` ini — tidak ada komponen UI yang boleh
 * memanggil `fetch` langsung.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL

const TOKEN_KEY = 'absensi_token'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * @param {string} endpoint - contoh: '/auth/login'
 * @param {object} options
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [options.method]
 * @param {object|FormData} [options.body]
 * @param {object} [options.headers]
 * @param {boolean} [options.auth] - lampirkan Authorization header (default: true)
 */
async function request(endpoint, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const isFormData = body instanceof FormData
  const finalHeaders = { ...headers }

  if (!isFormData && body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: finalHeaders,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch gagal total (server mati, tidak ada koneksi, dll) — bukan error dari backend
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', {
      status: 0,
    })
  }

  let payload = null
  const raw = await response.text()
  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      // Token tidak valid/expired — beri tahu AuthContext secara global
      // supaya user otomatis logout & diarahkan ke /login, di mana pun
      // request ini dipanggil dari.
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    const message = payload?.message || 'Terjadi kesalahan. Silakan coba lagi.'
    throw new ApiError(message, { status: response.status, data: payload?.data })
  }

  return payload
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  getToken,
  setToken,
  clearToken,
}
