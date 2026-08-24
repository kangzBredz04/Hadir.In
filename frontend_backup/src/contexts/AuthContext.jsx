import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'

export const AuthContext = createContext(null)

/**
 * Menyimpan status login di memori React + token JWT di localStorage.
 *
 * Catatan keamanan: `user.role` yang tersimpan di sini HANYA dipakai untuk
 * kebutuhan UX (menampilkan menu, redirect awal). Ini bukan sumber otorisasi
 * yang sebenarnya — setiap endpoint tetap memvalidasi role di backend
 * berdasarkan token, bukan berdasarkan apa yang dikirim/disimpan frontend.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const clearSession = useCallback(() => {
    authService.clearToken()
    setUser(null)
    setToken(null)
  }, [])

  // Saat aplikasi pertama kali dimuat: jika ada token tersimpan, validasikan
  // ke backend (GET /auth/me). Jika token sudah expired/invalid, sesi
  // dibersihkan otomatis dan user akan diarahkan ke /login oleh ProtectedRoute.
  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const existingToken = authService.getToken()
      if (!existingToken) {
        setIsInitializing(false)
        return
      }

      try {
        const profile = await authService.getProfile()
        if (!isMounted) return
        setUser(profile)
        setToken(existingToken)
      } catch {
        if (isMounted) clearSession()
      } finally {
        if (isMounted) setIsInitializing(false)
      }
    }

    bootstrap()

    // Dipicu oleh services/api.js setiap kali ada response 401 dari
    // endpoint manapun — menandakan token sudah tidak valid lagi.
    function handleUnauthorized() {
      clearSession()
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      isMounted = false
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [clearSession])

  const login = useCallback(async (email, password) => {
    const { token: newToken, user: newUser } = await authService.login(email, password)
    authService.setToken(newToken)
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
    }),
    [user, token, isInitializing, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
