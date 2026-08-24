# Hadir.In Frontend — Tahap 2

Fondasi frontend sistem absensi karyawan menggunakan React, Vite, JavaScript, Tailwind CSS, React Router DOM, Lucide React, React Webcam, dan pnpm.

## Menjalankan proyek

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Buka alamat yang ditampilkan Vite. Backend default dikonfigurasi pada `VITE_API_URL=http://localhost:3000/api`.

## Validasi

```bash
pnpm lint
pnpm build
pnpm preview
```

## API authentication

Frontend menggunakan endpoint berikut:

```text
POST /api/auth/login
GET  /api/auth/me
```

Format response login yang direkomendasikan:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "Wahyu",
      "email": "wahyu@example.com",
      "role": "EMPLOYEE"
    }
  }
}
```

Tahap 2 mencakup halaman login, show/hide password, loading dan error state, `AuthContext`, `useAuth`, token handling, pemulihan sesi melalui backend, `ProtectedRoute`, `RoleRoute`, redirect berdasarkan role, logout, dan penanganan otomatis response `401`.

Token JWT disimpan di `sessionStorage`, sedangkan user dan role selalu diverifikasi kembali melalui backend. Dashboard pada tahap ini masih berupa halaman verifikasi authentication dan akan diganti pada Tahap 3.
