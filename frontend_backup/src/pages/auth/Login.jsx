import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ApiError } from '../../services/api'
import { handleApiError } from '../../utils/errorHandler'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }

    setIsSubmitting(true)
    try {
      const user = await login(email, password)
      const redirectTo =
        location.state?.from?.pathname ||
        (user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      // Selalu tampilkan pesan generik untuk kegagalan login, jangan
      // meneruskan teks mentah dari backend ke user.
      if (err instanceof ApiError && err.status === 401) {
        setError('Email atau password salah.')
      } else {
        setError(handleApiError(err))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <ShieldCheck size={22} strokeWidth={2.25} />
          </div>
          <h1 className="text-heading mt-4">Absensi</h1>
          <p className="text-body mt-1 text-muted">Masuk untuk melakukan absensi harian</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-border bg-surface p-6 shadow-sm"
        >
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted transition-colors hover:text-text"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-md bg-danger-light px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-6">
            {isSubmitting ? 'Memproses...' : 'Login'}
          </Button>
        </form>

        <p className="text-caption mt-6 text-center">
          Lupa password? Hubungi admin HR perusahaan Anda.
        </p>
      </div>
    </div>
  )
}
