<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request; // Masih diperlukan untuk index method
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Admin\UpdateUserRoleRequest; // Pastikan ini diimpor untuk validasi peran

class UserController extends Controller
{
    // Ini adalah metode untuk menampilkan daftar pengguna di halaman Admin/Users/Index
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('roles')->get(), // Ambil semua pengguna dengan perannya
            // Pastikan format roles sesuai yang diharapkan frontend (object dengan id dan name)
            'roles' => Role::all()->map(fn($role) => ['id' => $role->id, 'name' => $role->name]),
        ]);
    }

    public function updateRole(Request $request, $id)
{
    $user = User::findOrFail($id);
    $user->syncRoles($request->role);

    // Return redirect tanpa pesan/status apa pun
    return redirect()->route('admin.users.index');
}


}