# TAMA STORE — GitHub Pages + Supabase

Versi ini memakai GitHub Pages untuk frontend dan Supabase untuk database + login admin.

## 1. Buat project Supabase
1. Buka https://supabase.com/
2. Buat project baru.
3. Buka SQL Editor, tempel isi `supabase.sql`, lalu Run.
4. Buka Project Settings → API, salin Project URL dan anon/public key.
5. Buka Authentication → Users → Add user, buat email + password admin.

## 2. Masukkan konfigurasi
Edit `admin.js` dan `script.js`, ganti:
- `PASTE_SUPABASE_URL_HERE` dengan Project URL
- `PASTE_SUPABASE_ANON_KEY_HERE` dengan anon/public key

Anon/public key memang boleh berada di frontend jika Row Level Security (RLS) aktif. JANGAN masukkan `service_role` key ke GitHub.

## 3. Upload ke GitHub Pages
Upload semua file langsung ke root repository, termasuk `supabase.sql`. Aktifkan Settings → Pages → Deploy from branch → main → /(root).

## 4. Login admin
Buka `/admin.html`, lalu login memakai email/password akun Supabase Auth.

Setelah itu tambah/edit/hapus produk dan simpan pengaturan. Data tersimpan di Supabase dan dapat dibaca pengunjung lain.

Catatan: URL gambar harus publik (misalnya URL gambar/CDN).
