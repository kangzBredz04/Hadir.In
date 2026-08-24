import { api, ApiError } from './api'

/**
 * Kontrak API yang diasumsikan (Express.js backend):
 *
 * POST /auth/login   body: { email, password }
 *   -> { success, message, data: { token, user: { id, name, email, role, ... } } }
 *
 * GET /auth/me        (Authorization: Bearer <token>)
 *   -> { success, message, data: { id, name, email, role, ... } }
 */
export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password }, { auth: false })
    const { token, user } = response?.data ?? {}

    if (!token || !user) {
      throw new ApiError('Email atau password salah.', { status: 401 })
    }

    return { token, user }
  },

  async getProfile() {
    const response = await api.get('/auth/me')
    return response?.data ?? null
  },

  logout() {
    api.clearToken()
  },

  getToken: api.getToken,
  setToken: api.setToken,
  clearToken: api.clearToken,
}
