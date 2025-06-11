<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## WorkDesk

## Anggota Tim

- 152023024 Yasrifal Fawaz
- 152023101 Muhammmad Ilham Hanafi
- 152023161 Nouval M Abdul Rojak
- 152023162 Muhammad Fadhlan Pratama

## Instalasi Projek
1. <h3>Clone projek ke dalam folder <b>laragon/www</b><h3>
git clone https://github.com/YasrifalFawaz/tubes-weblanjut.git

2. <h3>Buka terminal lalu masuk ke dalam projek</h3>
cd laragon/www/tubes-weblanjut

3. <h3>Install Dependency yang dibutuhkan</h3>
composer install
npm install

4. <h3>Salin file .env</h3>
cp .env.example .env

5. <h3>Jalankan Migrasi Database</h3>
php artisan migrate

6. <h3>Masukkan Data ke Database</h3>
php artisan db:seed

7. <h3>Generate App Key Laravel</h3>
php artisan key:generate

8. <h3>Generate JWT Secret</h3>
php artisan jwt:secret

## Menjalankan Projek
- npm run dev
<h3>Akses di browser lelaui</h3>
- tubes-weblanjut.test

## Account Testing
- Admin</br>
email : admin@admin.com</br>
password : admin123
- Manager Proyek</br>
email : manager@manager.com</br>
password : manager123
- Anggota Tim</br>
email : member@gmail.com</br>
password : 12345678
