# Witama Store.ID — Final

Versi final katalog GitHub Pages dengan Supabase.

## Isi versi ini
- Branding: **Witama Store.ID**.
- Desain portrait/mobile **Futuristic Dark**.
- Menu website hanya **Beranda**.
- Produk tampil sebagai kartu compact.
- Klik produk membuka detail: **logo, nama, deskripsi, dan link tujuan**.
- Tombol **Buka Produk** membuka link tujuan.
- Admin tetap menggunakan Supabase Auth + database.
- Tambah/edit produk: foto dipilih **langsung dari file HP**, bukan URL.
- Logo kecil dan logo besar/background juga dipilih **langsung dari file HP**.
- File foto disimpan ke Supabase Storage bucket `media`.
- Session JWT otomatis direfresh ketika kedaluwarsa.

## Setup Supabase
1. Buka Supabase > SQL Editor.
2. Jalankan seluruh isi `supabase.sql` satu kali.
3. Pastikan user admin sudah dibuat di Authentication > Users.
4. Upload semua file ZIP ini ke root repository GitHub Pages.
5. Buka `admin.html`, login memakai email/password Supabase.

## Penting
Jika Supabase kamu memakai pengaturan Data API exposure manual, expose tabel:
- `public.products`
- `public.site_settings`

Jangan mengganti anon/publishable key dengan service role key di file website.
