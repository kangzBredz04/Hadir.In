# Hadir.In Backend

REST API absensi karyawan menggunakan Express.js, PostgreSQL/Supabase, Sequelize, JWT, Argon2, Multer, dan Supabase Storage.

## Setup

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs`  
OpenAPI JSON: `http://localhost:3000/openapi.json`

## Environment

```env
NODE_ENV=development
PORT=3000
APP_TIMEZONE=Asia/Jakarta

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=1d

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=attendance-photos
PHOTO_SIGNED_URL_EXPIRES_IN=3600

TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=
TEST_EMPLOYEE_EMAIL=
TEST_EMPLOYEE_PASSWORD=
```

Jangan commit `.env`, jangan kirim JWT secret atau Supabase service role ke frontend.

## Endpoint

Public:
- `GET /api/health`
- `POST /api/auth/login`

Employee:
- `GET /api/users/me`
- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out`
- `GET /api/attendance/today`
- `GET /api/attendance/history`

Admin:
- `GET/POST /api/admin/users`
- `GET/PUT/DELETE /api/admin/users/:id`
- `GET/POST /api/admin/offices`
- `GET/PUT/DELETE /api/admin/offices/:id`
- `GET /api/admin/attendance`
- `GET /api/admin/attendance/summary`
- `GET /api/admin/attendance/:id`

## Check-In / Check-Out

Gunakan `multipart/form-data` dengan field:
- `photo`
- `latitude`
- `longitude`

Backend menentukan user dari JWT, bukan `user_id` dari frontend.

## Testing

Isi credential seed test di `.env`, lalu:

```bash
pnpm test
```

Jangan arahkan integration test development ke database production.
