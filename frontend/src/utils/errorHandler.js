const DEFAULT_MESSAGE =
    'Terjadi kendala. Silakan coba lagi.';

const statusMessages = {
    400:
        'Data yang dikirim belum sesuai.',

    401:
        'Email atau password salah.',

    403:
        'Akun Anda tidak memiliki akses untuk melakukan tindakan ini.',

    404:
        'Data yang diminta tidak ditemukan.',

    409:
        'Data mengalami konflik.',

    422:
        'Data yang dimasukkan belum valid.',

    429:
        'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',

    500:
        'Server sedang mengalami kendala. Silakan coba lagi.'
};

export function handleApiError(
    error,
    fallbackMessage =
        DEFAULT_MESSAGE
) {
    if (
        error instanceof TypeError
    ) {
        return (
            'Tidak dapat terhubung ke server. ' +
            'Periksa koneksi Anda lalu coba lagi.'
        );
    }

    if (
        error?.message ===
        'Konfigurasi VITE_API_URL belum tersedia.'
    ) {
        return (
            'Konfigurasi aplikasi belum lengkap.'
        );
    }

    return (
        statusMessages[
        error?.status
        ] ??
        fallbackMessage
    );
}