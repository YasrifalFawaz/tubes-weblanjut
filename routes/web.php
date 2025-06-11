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
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Project list (semua role)
        Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
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
    });

    // Rute Manajer Proyek dan Admin
    Route::middleware(['auth', 'role:manajer proyek|admin'])->group(function () {
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::put('/projects/{project}/update-status', [ProjectController::class, 'updateStatus'])->name('projects.update-status');
        Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    });

    // Rute Anggota Tim, Manajer Proyek, Admin
    Route::middleware(['auth', 'role:anggota tim|manajer proyek|admin'])->group(function () {
        Route::get('/tasks', function () {
            return Inertia::render('Task/Index');
        })->name('tasks.index');
    });

    // Auth routes
    require __DIR__.'/auth.php';
