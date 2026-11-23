# Manajemen Produk (Frontend)

Frontend React untuk API produk. Dibangun dengan React, TypeScript, Vite, React Router, dan Tailwind CSS dengan struktur Atomic Design.

## Fitur

- Daftar produk dari backend, dengan pencarian nama
- Tambah, edit, dan hapus produk lewat pop-up (data tersimpan di database)
- Halaman detail produk di `/products/:id`
- Halaman 404 untuk alamat yang tidak terdaftar

## Menjalankan backend dan frontend

Backend ada di root repository, frontend di folder `frontend`. Jalankan keduanya di dua terminal.

**1. Backend** (port 3000), dari root repository:

```sh
npm install
npx prisma generate
npm run dev
```

Pastikan file `.env` di root sudah berisi `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, dan `PORT`. Untuk mengisi data awal: `npm run seed`.

**2. Frontend** (port 5173), dari folder `frontend`:

```sh
npm ci
npm run dev
```

Buka http://127.0.0.1:5173. Alamat backend dibaca dari `VITE_API_BASE_URL` di `frontend/.env.local`. Jika berkas itu tidak ada, dipakai `http://localhost:3000`.

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan aplikasi untuk pengembangan |
| `npm run typecheck` | Memeriksa tipe TypeScript |
| `npm run lint` | Memeriksa aturan kode |
| `npm test` | Menjalankan unit test |
| `npm run build` | Memeriksa tipe dan membuat build produksi |