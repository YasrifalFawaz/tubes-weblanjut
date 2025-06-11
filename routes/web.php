<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Halaman awal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Dashboard setelah login
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rute umum untuk user login
Route::middleware('auth')->group(function () {
    // Project list (semua user login)
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

    // Project Detail & Task Board (semua user login)
    // PENTING: Posisikan rute ini di atas rute yang berpotensi konflik seperti projects/create atau projects/{id}/edit
    Route::get('/projects/{project}/task', [ProjectController::class, 'show'])->name('projects.show');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rute khusus admin
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Update Role khusus
    Route::put('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');

    // Project Status Update (Hanya Admin) - Pastikan ini hanya di sini jika Manajer Proyek tidak bisa update status
    Route::put('/projects/{project}/update-status', [ProjectController::class, 'updateStatus'])->name('projects.update-status');
});

Route::middleware(['auth', 'role:manajer proyek'])->group(function () {
    Route::put('/projects/{project}/assign-users', [ProjectController::class, 'assignUsers'])->name('projects.assign-users');
});

// Rute Manajer Proyek dan Admin
Route::middleware(['auth', 'role:manajer proyek|admin'])->group(function () {
    // Project Creation
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');

    // Project Editing/Updating (Gunakan {project} untuk Route Model Binding yang konsisten)
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit'); // Dari {id} ke {project}
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update'); // Dari {id} ke {project}

    // Project Deletion (Gunakan {project})
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy'); // Dari {id} ke {project}
});

// Rute Anggota Tim, Manajer Proyek, Admin (untuk Task/Index)
Route::middleware(['auth', 'role:anggota tim|manajer proyek|admin'])->group(function () {
    Route::get('/tasks', function () {
        return Inertia::render('Task/Index'); // Asumsikan Task/Index.tsx ada di Pages/Task/
    })->name('tasks.index');
});

// Auth routes (dari Laravel Breeze)
require __DIR__.'/auth.php';