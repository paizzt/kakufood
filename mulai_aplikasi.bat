@echo off
setlocal EnableDelayedExpansion
title Menjalankan Aplikasi Kaku Food
echo ===================================================
echo Memeriksa Persyaratan (Prerequisites) Sistem...
echo ===================================================
echo.

:: Cek Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Git tidak ditemukan! Harap install Git terlebih dahulu.
    echo     Buka: https://git-scm.com/
    goto :error
) else (
    echo [V] Git terdeteksi.
)

:: Cek PHP
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] PHP tidak ditemukan! Harap install PHP ^(misalnya via XAMPP atau Laragon^).
    echo     Pastikan PHP sudah didaftarkan ke System PATH.
    goto :error
) else (
    echo [V] PHP terdeteksi.
)

:: Cek Composer
where composer >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Composer tidak ditemukan! Harap install Composer terlebih dahulu.
    echo     Buka: https://getcomposer.org/
    goto :error
) else (
    echo [V] Composer terdeteksi.
)

:: Cek Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js tidak ditemukan! Harap install Node.js terlebih dahulu.
    echo     Buka: https://nodejs.org/
    goto :error
) else (
    echo [V] Node.js terdeteksi.
)

:: Cek NPM
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] NPM tidak ditemukan! Harap install Node.js yang sudah termasuk NPM.
    goto :error
) else (
    echo [V] NPM terdeteksi.
)

echo.
echo Semua persyaratan perangkat lunak terpenuhi!
echo ===================================================
echo.

echo [1/5] Mengambil pembaruan terbaru dari GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo [!] PERINGATAN: Gagal menarik update dari Git. Melanjutkan dengan versi lokal yang ada...
)
echo.

echo [2/5] Memeriksa dependensi dan konfigurasi Backend (PHP/Laravel)...
if not exist "backend" (
    echo [X] Folder 'backend' tidak ditemukan! Pastikan script dijalankan di folder utama (root) proyek.
    goto :error
)
cd backend

:: Cek dan buat file .env backend jika belum ada
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Membuat file .env untuk Backend...
        copy .env.example .env >nul
    ) else (
        echo [X] File .env.example tidak ditemukan di backend!
        cd ..
        goto :error
    )
)

echo Menginstall paket Composer...
call composer install
if %errorlevel% neq 0 (
    echo [X] Gagal menjalankan composer install!
    cd ..
    goto :error
)

:: Cek apakah APP_KEY kosong di .env, jika ya, generate.
findstr /C:"APP_KEY=" .env >nul
if %errorlevel% equ 0 (
    findstr /C:"APP_KEY=base64" .env >nul
    if %errorlevel% neq 0 (
        echo [INFO] Membuat APP_KEY...
        call php artisan key:generate
    )
)

echo Menjalankan migrasi database (opsional jika baru)...
call php artisan migrate --force
if %errorlevel% neq 0 (
    echo [!] PERINGATAN: Gagal melakukan migrasi database.
    echo     Pastikan aplikasi database MySQL/XAMPP sudah berjalan dan pengaturan di file backend/.env sudah benar.
)
cd ..
echo.

echo [3/5] Memeriksa dependensi dan konfigurasi Frontend (Node.js/Next.js)...
if not exist "frontend" (
    echo [X] Folder 'frontend' tidak ditemukan! Pastikan script dijalankan di folder utama (root) proyek.
    goto :error
)
cd frontend

:: Cek dan buat file .env frontend jika belum ada
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Membuat file .env untuk Frontend...
        copy .env.example .env >nul
    ) else (
        echo [INFO] File .env.example tidak ditemukan di frontend, melanjutkan...
    )
)

echo Menginstall paket NPM...
call npm install
if %errorlevel% neq 0 (
    echo [X] Gagal menjalankan npm install!
    cd ..
    goto :error
)
cd ..
echo.

echo [4/5] Memeriksa status Port...
:: Cek port 8000 untuk Laravel
netstat -aon | findstr ":8000 " >nul
if %errorlevel% equ 0 (
    echo [!] PERINGATAN: Port 8000 (Backend) sedang digunakan oleh program lain.
    echo     Server backend mungkin gagal berjalan atau akan berpindah ke port lain (misal 8001).
)
:: Cek port 3000 untuk Next.js
netstat -aon | findstr ":3000 " >nul
if %errorlevel% equ 0 (
    echo [!] PERINGATAN: Port 3000 (Frontend) sedang digunakan oleh program lain.
    echo     Server frontend mungkin gagal berjalan atau akan berpindah ke port lain (misal 3001).
)
echo.

echo [5/5] Menjalankan Server...
echo Menjalankan server Backend (Laravel) di jendela baru...
start "Backend Laravel" cmd /k "cd backend && php artisan serve"

echo Menjalankan server Frontend (Next.js) di jendela baru...
start "Frontend Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo PROSES SELESAI! 
echo.
echo Server telah dijadwalkan berjalan di jendela terpisah.
echo - Backend : http://127.0.0.1:8000
echo - Frontend: http://localhost:3000
echo.
echo Silakan buka browser Anda dan akses: http://localhost:3000
echo.
echo (Biarkan jendela terminal yang baru terbuka. Jika ingin mematikan server, cukup tutup jendela terminal tersebut.)
echo ===================================================
pause
exit /b

:error
echo.
echo ===================================================
echo TERJADI KESALAHAN!
echo Proses dihentikan karena adanya kendala pada sistem atau file.
echo Silakan perbaiki masalah yang disebutkan (tanda [X]) lalu jalankan kembali script ini.
echo ===================================================
pause
exit /b
