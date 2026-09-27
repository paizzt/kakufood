<div align="center">
  <img src="https://ui-avatars.com/api/?name=Kaku+Food&background=0D8ABC&color=fff&size=150&rounded=true" alt="Kaku Food Logo">
  
  <h1>🛠️ Kaku Food - Equipment Monitoring System</h1>
  
  <p>
    <strong>Sistem Cerdas Pemantauan & Manajemen Aset Perusahaan Terpadu</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11" />
    <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
</div>

<br />

> **Kaku Food Equipment Monitoring System** adalah solusi digital untuk melacak, memelihara, dan memastikan integritas data dari setiap peralatan yang ada di seluruh cabang Kaku Food. Dengan sistem keamanan berbasis *Hashing SHA-256*, data Anda aman dari manipulasi.

---

## ✨ Fitur Unggulan

<details open>
<summary><b>🛡️ Keamanan & Integritas Data (Audit Trail)</b></summary>
Setiap aktivitas (tambah, edit, hapus) dicatat secara otomatis. Sistem akan menghasilkan <i>hash (SHA-256)</i> unik untuk memverifikasi bahwa data tidak pernah dimanipulasi secara ilegal melalui <i>database</i>.
</details>

<details open>
<summary><b>📦 Manajemen Inventaris Real-time</b></summary>
Lacak posisi peralatan berdasarkan cabang dan lokasi spesifiknya. Pantau total nilai aset dan kondisi barang secara langsung.
</details>

<details open>
<summary><b>🛠️ Laporan Kerusakan & Riwayat Servis</b></summary>
Punya barang yang rusak? Staf dapat langsung melaporkan kerusakan melalui sistem. Admin dan teknisi dapat menambahkan riwayat pemeliharaan serta estimasi biaya perbaikan.
</details>

<details open>
<summary><b>👥 Role-based Access Control (RBAC)</b></summary>
Akses aman yang dibedakan antara <b>Admin</b> (kontrol penuh) dan <b>Staff</b> (terbatas pada cabang tertentu).
</details>

---

## 💻 Tech Stack

| Frontend 🎨 | Backend ⚙️ |
| :--- | :--- |
| **Next.js 14** (React Framework) | **Laravel 11** (PHP Framework) |
| **TypeScript** (Static Typing) | **Laravel Sanctum** (API Auth) |
| **Bootstrap 5** (UI Component) | **SQLite** (Relational DB) |
| **Lucide React** (Icons) | **PHP 8.2+** |
| **SweetAlert2** (Popups & Alerts) | **Composer** (Package Manager) |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibagi menjadi dua *repository* di dalam satu folder: `frontend` dan `backend`. Ikuti langkah berikut untuk menjalankan di mesin lokal Anda.

### 1️⃣ Menyiapkan Backend (API Server)
Buka terminal dan arahkan ke folder `backend`:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```
*Tunggu hingga server berjalan di `http://127.0.0.1:8000`*

### 2️⃣ Menyiapkan Frontend (Web UI)
Buka terminal baru dan arahkan ke folder `frontend`:
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local
npm run dev
```
*Buka browser dan akses [http://localhost:3000](http://localhost:3000)*

---

## 🔑 Akun Demo (Sandboxing)

Gunakan salah satu akun berikut untuk mencoba fitur-fitur yang ada di dalam aplikasi (Data sudah di-isi oleh Seeder).

| Role | Email | Password | Hak Akses |
| :---: | :--- | :--- | :--- |
| 👑 **Admin** | `admin@kakufood.com` | `password` | Seluruh Cabang & Fitur |
| 👤 **Staff Pusat** | `staff@kakufood.com` | `password` | Terbatas (Cabang Makassar) |
| 👤 **Staff Gowa** | `gowa@kakufood.com` | `password` | Terbatas (Cabang Gowa) |

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk sistem manajemen <b>Kaku Food</b>.</p>
</div>
