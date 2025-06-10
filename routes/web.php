<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController; // Pastikan ini diimpor
use App\Http\Controllers\ProjectController;

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
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
});

// --- Rute yang Dilindungi Peran ---

// Rute untuk Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    // --- Rute Manajemen Pengguna (CRUD) ---
    // Gunakan ini untuk menampilkan daftar pengguna dari controller
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    // Rute untuk update peran pengguna
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.updateRole');
});

// Contoh Rute untuk Manajer Proyek (dan juga Admin)
Route::middleware(['auth', 'role:manajer proyek|admin'])->group(function () {
    // Ganti Inertia::render langsung dengan menggunakan controller
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('/projects/{id}/status', [ProjectController::class, 'updateStatus'])->name('projects.updateStatus');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store'); // Untuk menyimpan proyek baru
});

// Contoh Rute untuk Anggota Tim (dan juga Manajer Proyek, Admin)
Route::middleware(['auth', 'role:anggota tim|manajer proyek|admin'])->group(function () {
    Route::get('/tasks', function () {
        return Inertia::render('Task/Index');
    })->name('tasks.index');
});

require __DIR__.'/auth.php';