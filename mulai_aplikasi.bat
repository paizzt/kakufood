@echo off
title Menjalankan Aplikasi Kaku Food
echo ===================================================
echo Memeriksa Sistem...
echo ===================================================
echo.

where git >nul 2>nul
if not errorlevel 1 echo [V] Git terdeteksi.
if errorlevel 1 echo [X] Git TIDAK ditemukan.

where php >nul 2>nul
if not errorlevel 1 echo [V] PHP terdeteksi.
if errorlevel 1 echo [X] PHP TIDAK ditemukan.

where composer >nul 2>nul
if not errorlevel 1 echo [V] Composer terdeteksi.
if errorlevel 1 echo [X] Composer TIDAK ditemukan.

where node >nul 2>nul
if not errorlevel 1 echo [V] Node.js terdeteksi.
if errorlevel 1 echo [X] Node.js TIDAK ditemukan.

where npm >nul 2>nul
if not errorlevel 1 echo [V] NPM terdeteksi.
if errorlevel 1 echo [X] NPM TIDAK ditemukan.

echo.
echo Melanjutkan proses (Universal Mode)...
echo ===================================================
echo.

echo [1/4] Mengambil pembaruan terbaru dari GitHub...
call git pull origin main
echo.

echo [2/4] Menyiapkan Backend (PHP/Laravel)...
cd backend
if not exist ".env" copy .env.example .env >nul
call composer install
call php artisan key:generate
call php artisan migrate --force
cd ..
echo.

echo [3/4] Menyiapkan Frontend (Node.js/Next.js)...
cd frontend
if not exist ".env" copy .env.example .env >nul
call npm install
cd ..
echo.

echo [4/4] Menjalankan Server...
start "Backend Laravel" cmd /k "cd backend && php artisan serve"
start "Frontend Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo PROSES SELESAI!
echo Server telah dijadwalkan berjalan di jendela terpisah.
echo.
echo Silakan buka browser Anda dan akses: http://localhost:3000
echo ===================================================
pause
