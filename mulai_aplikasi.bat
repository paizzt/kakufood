@echo off
title Menjalankan Aplikasi Kaku Food
echo ===================================================
echo Memeriksa Persyaratan Sistem...
echo ===================================================
echo.

where git >nul 2>nul
if errorlevel 1 goto err_git
echo [V] Git terdeteksi.

where php >nul 2>nul
if errorlevel 1 goto err_php
echo [V] PHP terdeteksi.

where composer >nul 2>nul
if errorlevel 1 goto err_composer
echo [V] Composer terdeteksi.

where node >nul 2>nul
if errorlevel 1 goto err_node
echo [V] Node.js terdeteksi.

where npm >nul 2>nul
if errorlevel 1 goto err_npm
echo [V] NPM terdeteksi.

echo.
echo Semua persyaratan terpenuhi.
echo ===================================================
echo.

echo [1/5] Mengambil pembaruan terbaru dari GitHub...
call git pull origin main
echo.

echo [2/5] Memeriksa konfigurasi Backend...
if not exist "backend\composer.json" goto err_backend
cd backend

if exist ".env" goto skip_env_backend
if not exist ".env.example" goto err_env_backend
echo Membuat file .env untuk Backend...
copy .env.example .env >nul
call php artisan key:generate
:skip_env_backend

echo Menginstall paket Composer...
call composer install
if errorlevel 1 goto err_composer_install

echo Menjalankan migrasi database...
call php artisan migrate --force

cd ..
echo.

echo [3/5] Memeriksa konfigurasi Frontend...
if not exist "frontend\package.json" goto err_frontend
cd frontend

if exist ".env" goto skip_env_frontend
if not exist ".env.example" goto skip_env_frontend
echo Membuat file .env untuk Frontend...
copy .env.example .env >nul
:skip_env_frontend

echo Menginstall paket NPM...
call npm install
if errorlevel 1 goto err_npm_install
cd ..
echo.

echo [4/5] Menjalankan Server...
echo Menjalankan server Backend di jendela baru...
start "Backend Laravel" cmd /k "cd backend && php artisan serve"

echo Menjalankan server Frontend di jendela baru...
start "Frontend Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo PROSES SELESAI!
echo Silakan buka browser Anda dan akses: http://localhost:3000
echo ===================================================
pause
exit /b

:err_git
echo [X] Git tidak ditemukan. Harap install dari git-scm.com.
goto end_err

:err_php
echo [X] PHP tidak ditemukan. Pastikan sudah masuk System PATH.
goto end_err

:err_composer
echo [X] Composer tidak ditemukan. Harap install dari getcomposer.org.
goto end_err

:err_node
echo [X] Node.js tidak ditemukan. Harap install dari nodejs.org.
goto end_err

:err_npm
echo [X] NPM tidak ditemukan.
goto end_err

:err_backend
echo [X] Folder backend atau file composer.json tidak ditemukan.
goto end_err

:err_env_backend
echo [X] File .env.example tidak ditemukan di folder backend.
cd ..
goto end_err

:err_composer_install
echo [X] Gagal menjalankan composer install.
cd ..
goto end_err

:err_frontend
echo [X] Folder frontend atau file package.json tidak ditemukan.
goto end_err

:err_npm_install
echo [X] Gagal menjalankan npm install.
cd ..
goto end_err

:end_err
echo.
echo ===================================================
echo TERJADI KESALAHAN!
echo Proses dihentikan. Silakan perbaiki masalah di atas lalu jalankan ulang.
echo ===================================================
pause
exit /b
