@echo off
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
echo Semua persyaratan terpenuhi! Melanjutkan ke proses instalasi dan peluncuran aplikasi...
echo ===================================================
echo.

echo [1/4] Mengambil pembaruan terbaru dari GitHub...
git pull origin main
echo.

echo [2/4] Memeriksa dan menginstall dependensi Backend (PHP/Laravel)...
cd backend
call composer install
cd ..
echo.

echo [3/4] Memeriksa dan menginstall dependensi Frontend (Node.js/Next.js)...
cd frontend
call npm install
cd ..
echo.

echo [4/4] Menjalankan Server...
echo Menjalankan server Backend (Laravel) di jendela baru...
start "Backend Laravel" cmd /k "cd backend && php artisan serve"

echo Menjalankan server Frontend (Next.js) di jendela baru...
start "Frontend Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo BERHASIL! 
echo.
echo Server telah dijalankan di jendela terpisah.
echo - Backend berjalan di: http://127.0.0.1:8000
echo - Frontend berjalan di: http://localhost:3000
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
echo Aplikasi gagal dijalankan karena ada persyaratan yang belum terpenuhi.
echo Silakan install aplikasi yang bertanda [X] di atas lalu coba jalankan kembali file ini.
echo ===================================================
pause
exit /b
