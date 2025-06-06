<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- Tambahkan Rute yang Dilindungi Peran di Sini ---

// Contoh Rute untuk Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/users', function () {
        // Logika untuk menampilkan halaman manajemen user
        return Inertia::render('Admin/UserManagement'); // Anda perlu membuat komponen React ini
    })->name('admin.users');

    // Tambahkan rute admin lainnya di sini
});

// Contoh Rute untuk Manajer Proyek (dan juga Admin)
Route::middleware(['auth', 'role:manajer proyek|admin'])->group(function () {
    Route::get('/projects', function () {
        // Logika untuk menampilkan daftar proyek
        return Inertia::render('Project/Index'); // Anda perlu membuat komponen React ini
    })->name('projects.index');

    Route::get('/projects/create', function () {
        // Logika untuk menampilkan form buat proyek baru
        return Inertia::render('Project/Create'); // Anda perlu membuat komponen React ini
    })->name('projects.create');
    // Tambahkan rute manajer proyek lainnya
});

// Contoh Rute untuk Anggota Tim (dan juga Manajer Proyek, Admin)
Route::middleware(['auth', 'role:anggota tim|manajer proyek|admin'])->group(function () {
    Route::get('/tasks', function () {
        // Logika untuk menampilkan daftar tugas
        return Inertia::render('Task/Index'); // Anda perlu membuat komponen React ini
    })->name('tasks.index');
    // Tambahkan rute anggota tim lainnya
});


require __DIR__.'/auth.php';