<?php

namespace App\Http\Controllers;

use App\Models\Project;
// use App\Models\User; // Tidak perlu lagi mengimpor User jika tidak mengambil daftar user
use Illuminate\Http\Request; // <<< TAMBAHKAN INI
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // Pastikan ini ada

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $projects = Project::with('user')->get();
        // $users = User::all(); // <<< HAPUS BARIS INI

        return Inertia::render('Project/Index', [
            'projects' => $projects,
            // 'users' => $users, // <<< HAPUS BARIS INI
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        // Jika halaman create ini hanya untuk admin/manajer proyek, tidak perlu user list
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // 'user_id' tidak perlu divalidasi 'exists' karena akan diisi otomatis dari user yang login
        ]);

        Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(), // <<< UBAH BARIS INI: Otomatis mengisi dengan ID user yang login
            'status' => 'progress', // Set default status secara eksplisit atau biarkan database yang menangani
        ]);

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dibuat!');
    }

    // ... metode lain jika ada
}