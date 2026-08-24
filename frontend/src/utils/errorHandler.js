const DEFAULT_MESSAGE = 'Terjadi kendala. Silakan coba lagi.';

const statusMessages = {
  400: 'Data yang dikirim belum sesuai. Periksa kembali data Anda.',
  401: 'Sesi Anda tidak valid. Silakan login kembali.',
  403: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  404: 'Data yang diminta tidak ditemukan.',
  409: 'Data tersebut sudah terdaftar.',
  422: 'Data yang dimasukkan belum valid.',
  429: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
};

export function handleApiError(error, fallbackMessage = DEFAULT_MESSAGE) {
  if (error instanceof TypeError) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.';
  }

  if (error?.message === 'Konfigurasi VITE_API_URL belum tersedia.') {
    return 'Konfigurasi aplikasi belum lengkap. Hubungi administrator.';
  }

  if (error?.status >= 500) {
    return 'Server sedang mengalami kendala. Silakan coba beberapa saat lagi.';
  }

  return statusMessages[error?.status] || fallbackMessage;
}

export function handleLoginError(error) {
  if (error?.status === 400 || error?.status === 401) {
    return 'Email atau password salah.';
  }

  if (error?.status === 403) {
    return 'Akun Anda tidak aktif. Hubungi administrator.';
  }

  return handleApiError(error, 'Login gagal. Silakan coba lagi.');
}
