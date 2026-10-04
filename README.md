# Witama Store.ID — GitHub Pages + Supabase

Versi final ini dibuat khusus untuk GitHub Pages (tanpa Node/Express).

## Upload ke GitHub
1. Extract ZIP.
2. Masukkan SEMUA file langsung ke root repository.
3. Pastikan `index.html`, `admin.html`, `admin.js`, `script.js`, `style.css`, `data.js`, dan `supabase.sql` berada satu level.

## Supabase
Jalankan `supabase.sql` di Supabase SQL Editor.

### Login admin
Gunakan **email + password** user yang dibuat di Supabase Authentication.

### Upload foto
Versi ini sengaja **tidak menggunakan Supabase Storage**. Foto dari HP otomatis diperkecil di browser menjadi data URL lalu disimpan di tabel Supabase. Dengan begitu upload logo/foto tidak membutuhkan bucket Storage dan tidak terkena error RLS Storage.

## Penting
- Jangan mengganti anon/publishable key dengan service_role/secret key.
- Jika project Supabase baru saja dibuat/diubah, tunggu sebentar lalu refresh GitHub Pages.
- Jika browser masih menampilkan versi lama, buka dalam mode incognito atau lakukan hard refresh.

V14: memperbaiki Supabase anon key pada script publik dan cache-bust v14.


V15 bugfix: cache branding/katalog, logo tampil tanpa menunggu request, gambar katalog diambil dalam satu request, dan splash tidak lagi memaksa loading lama.
