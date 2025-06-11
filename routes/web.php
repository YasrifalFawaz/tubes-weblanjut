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
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
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

// Rute umum untuk user login (Membutuhkan autentikasi)
Route::middleware('auth')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}/task', [ProjectController::class, 'show'])->name('projects.show');

    // Profile Management Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tasks (Viewable by Anggota Tim, Manajer Proyek, Admin)
    Route::middleware('role:anggota tim|manajer proyek|admin')->group(function () {
        Route::get('/tasks', function () {
            return Inertia::render('Task/Index'); // Asumsikan Task/Index.tsx ada di Pages/Task/
        })->name('tasks.index');
        Route::post('/projects/{project}/tasks', [\App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
        Route::put('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'update'])->name('tasks.update');
        Route::delete('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'destroy'])->name('tasks.destroy');
    });

    Route::middleware('role:manajer proyek')->group(function () {
        Route::put('/projects/{id}/assign-users', [ProjectController::class, 'assignUsers'])->name('projects.assign-users'); // Menggunakan {id}
    });

    Route::middleware('role:manajer proyek|admin')->group(function () {
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    });

    Route::middleware('role:admin')->group(function () {
        // User Management (Admin only) - Menggunakan prefix 'admin' dan name 'admin.'
        Route::prefix('admin')->name('admin.')->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

            // Update Role khusus (Admin only)
            Route::put('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');
        });
        Route::put('/projects/{project}/update-status', [ProjectController::class, 'updateStatus'])->name('projects.update-status');
    });
});

require __DIR__.'/auth.php';