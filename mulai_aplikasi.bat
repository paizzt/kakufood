@echo off
title Menjalankan Aplikasi Kaku Food
echo ===================================================
echo Mempersiapkan dan Menjalankan Aplikasi Kaku Food
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
