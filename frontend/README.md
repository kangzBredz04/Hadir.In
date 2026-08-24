# Hadir.In Frontend — Tahap 8 (Final)

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

Token JWT disimpan di `sessionStorage`, sedangkan user dan role selalu diverifikasi kembali melalui backend.

## Employee — Tahap 3

Tahap 3 menambahkan:

- `EmployeeLayout` dengan sidebar desktop, mobile drawer, dan bottom navigation.
- Dashboard employee dengan greeting, status hari ini, check-in, check-out, lokasi, dan quick action.
- Halaman absensi sebagai fondasi UI untuk Camera + GPS pada Tahap 4.
- Halaman profil employee.
- Loading skeleton dan API error state dengan retry.
- `attendance.service.js` dan `useAttendance()`.

Dashboard dan halaman Absensi menggunakan endpoint:

```text
GET /api/attendance/today
```

## Camera + GPS — Tahap 4

Tahap 4 mengaktifkan:

- Permission GPS otomatis dengan pesan error ramah pengguna.
- Retry lokasi dan informasi akurasi GPS.
- Perhitungan jarak Haversine di frontend sebagai informasi UX.
- Kamera depan melalui `react-webcam`.
- Preview selfie dan fitur ambil ulang.
- Konversi data URL selfie menjadi file JPEG.
- Check-in dan check-out menggunakan `multipart/form-data`.
- Loading state selama pengiriman.
- Hasil berhasil, error, serta penolakan di luar radius.
- Refresh status hari ini setelah absensi berhasil.

Endpoint dan field multipart:

```text
POST /api/attendance/check-in
POST /api/attendance/check-out

photo      File
latitude   Text
longitude  Text
```

Frontend tidak mengirim `user_id`; backend menentukan user melalui JWT. Jangan mengatur header `Content-Type` secara manual untuk `FormData` karena browser akan membuat multipart boundary.

Geolocation dan kamera hanya dapat digunakan pada `localhost` atau koneksi HTTPS.

## Riwayat Absensi — Tahap 5

Tahap 5 menambahkan:

- Riwayat absensi employee dengan filter rentang tanggal.
- Tabel desktop dan kartu mobile yang responsive.
- Pagination berbasis metadata dari backend.
- Empty state, loading skeleton, error state, dan retry.
- Detail check-in/check-out berisi waktu, koordinat, jarak, kantor, dan foto.
- `PhotoViewer` responsive dengan modal, keyboard Escape, dan tautan foto asli.

Endpoint yang digunakan:

```text
GET /api/attendance/history?page=1&limit=10&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

Response yang diharapkan:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 1
    }
  }
}
```

Rute employee:

```text
/employee/history
/employee/history/:id?date=YYYY-MM-DD
```

Backend saat ini tidak menyediakan endpoint detail khusus employee. Halaman detail menerima record dari React Router state. Saat halaman di-refresh, frontend mengambil riwayat pada tanggal yang tercantum di query string lalu mencari record berdasarkan ID. Dengan demikian frontend tidak menggunakan endpoint admin dan tetap mengikuti batas role backend.

## Admin Portal — Tahap 6

Tahap 6 menambahkan layout dan route khusus role `ADMIN`:

```text
/admin/dashboard
/admin/employees
/admin/employees/:id
/admin/offices
/admin/offices/:id
/admin/attendance
/admin/attendance/:id
/admin/reports
/admin/profile
```

Fitur utama:

- Dashboard dengan statistik employee, hadir, terlambat, belum absen, dan absensi terbaru.
- Employee management: search, filter, pagination, create, edit, detail, dan deactivate.
- Office management: search, filter, pagination, create, edit, detail, koordinat, radius, dan deactivate.
- Attendance management: filter tanggal, employee, office, status, pagination, serta detail foto/lokasi.
- Sidebar desktop, drawer mobile, header admin, profile, dan confirmation logout.
- Reusable `Select`, `Modal`, `Dialog`, dan toast notification.
- Tampilan tabel desktop dan card mobile untuk data operasional.

Endpoint admin:

```text
GET    /api/admin/attendance/summary
GET    /api/admin/attendance
GET    /api/admin/attendance/:id

GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/offices
POST   /api/admin/offices
GET    /api/admin/offices/:id
PUT    /api/admin/offices/:id
DELETE /api/admin/offices/:id
```

Payload create employee mengikuti kontrak backend:

```text
employee_id, name, email, password, role, office_id, is_active
```

Payload office:

```text
name, address, latitude, longitude, radius_meter, is_active
```

Frontend menganggap `DELETE` sebagai aksi deactivate sesuai perilaku backend, bukan menghapus data secara permanen. Authorization tetap wajib divalidasi backend.

## Office Map — Tahap 7

Tahap 7 menggunakan `leaflet` dan `react-leaflet` untuk menambahkan peta kantor tanpa API key berbayar.

Fitur map:

- Peta OpenStreetMap pada form tambah dan edit Office.
- Klik peta untuk memilih koordinat kantor.
- Marker dapat digeser untuk memperbaiki posisi.
- Tombol **Lokasi saya** menggunakan `navigator.geolocation`.
- Latitude dan longitude disimpan hingga 7 angka desimal.
- Radius absensi divisualisasikan sebagai lingkaran dalam satuan meter.
- Perubahan input `radius_meter` langsung mengubah lingkaran di peta.
- Halaman detail Office menampilkan peta dan radius dalam mode read-only.
- Error permission, GPS tidak tersedia, dan timeout ditampilkan dengan pesan yang ramah pengguna.

Dependensi baru:

```text
leaflet
react-leaflet
```

Peta hanya membantu admin memilih lokasi dan memahami radius. Payload API Office tetap:

```text
name, address, latitude, longitude, radius_meter, is_active
```

Validasi final koordinat dan radius tetap menjadi tanggung jawab backend. Tile peta menggunakan OpenStreetMap dan membutuhkan koneksi internet pada browser.

## Finishing — Tahap 8

Tahap final menyelesaikan kualitas lintas aplikasi:

- Loading skeleton, spinner, disabled action, dan loading text pada request utama.
- Error state dengan pesan ramah pengguna dan tombol retry.
- Empty state khusus riwayat, employee, office, attendance, serta reports.
- Toast untuk login, logout, absensi, dan mutation admin.
- Confirmation dialog untuk logout dan deactivate.
- Global error boundary dengan pemulihan melalui reload.
- Indikator offline berdasarkan status jaringan browser.
- Focus trap dan pengembalian fokus pada modal serta photo viewer.
- Tombol Escape untuk menutup modal dan viewer.
- Skip link menuju konten utama.
- Judul dokumen dan route announcement yang berubah sesuai halaman.
- Caption dan header scope pada tabel untuk screen reader.
- Dukungan `prefers-reduced-motion`.
- Safe-area mobile untuk bottom navigation.
- Search header admin terhubung ke filter Employees.
- Pembersihan halaman placeholder yang sudah tidak digunakan.

Checklist accessibility:

- Semua input memiliki label.
- Tombol icon memiliki `aria-label`.
- Status penting menggunakan `role="status"` atau `role="alert"`.
- Modal menggunakan `role="dialog"` dan `aria-modal="true"`.
- Navigasi dapat digunakan dengan keyboard.
- Focus state terlihat jelas.
- Status attendance tidak hanya mengandalkan warna, tetapi juga icon dan label.

Tahap 8 tidak mengubah endpoint maupun payload backend dari tahap sebelumnya.
