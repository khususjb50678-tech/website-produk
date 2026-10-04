# TAMA STORE — GitHub Pages

Upload semua file di root repository. Website adalah static HTML/CSS/JS.

## GitHub Pages
Settings → Pages → Deploy from a branch → main → /(root) → Save.

## Admin
Buka `admin.html`.
Default:
- username: `admin`
- password: `admin123`

Ganti password dari menu Pengaturan.

## Penting
GitHub Pages tidak menjalankan backend/database. CRUD admin di project ini memakai localStorage browser. Artinya perubahan katalog hanya tersimpan pada browser/perangkat yang melakukan perubahan, bukan menjadi database publik untuk semua pengunjung.

Untuk katalog publik yang berubah untuk semua orang melalui Admin Panel, diperlukan backend/database atau CMS/API eksternal.
