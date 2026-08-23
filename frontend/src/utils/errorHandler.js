import { ApiError } from '../services/api'

const DEFAULT_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.'

/**
 * Ubah error dari lapisan API menjadi pesan yang aman ditampilkan ke user.
 * Backend sudah mengirim `message` yang ramah (lihat services/api.js),
 * jadi fungsi ini pada dasarnya hanya memastikan kita tidak pernah
 * menampilkan stack trace / error teknis mentah ke UI.
 */
export function handleApiError(error) {
  if (error instanceof ApiError) {
    return error.message || DEFAULT_MESSAGE
  }
  return DEFAULT_MESSAGE
}
