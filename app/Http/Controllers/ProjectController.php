<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User; // Pastikan ini diimpor untuk mengambil daftar user
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate; // Pastikan ini diimpor untuk Policy

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('admin') || $user->hasRole('manajer proyek')) {
            // Admin dan Manajer Proyek melihat semua proyek
            $projects = Project::with('user', 'assignedUsers')->get(); // Muat assignedUsers juga
        } else {
            // Anggota tim hanya melihat proyek yang ditugaskan padanya
            $projects = $user->assignedProjects()->with('user')->get();
        }

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        Gate::authorize('create', Project::class); // Otorisasi: Hanya yang diizinkan policy yang bisa create
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Project::class); // Otorisasi
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
            'status' => 'progress',
        ]);

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dibuat!');
    }

    /**
     * Display the specified project with its tasks.
     */
    public function show(Project $project) // Menggunakan Route Model Binding ($project)
    {
        Gate::authorize('view', $project); // Otorisasi: Hanya yang diizinkan policy yang bisa view

        $project->load(['user', 'tasks.user', 'tasks.comments.user', 'assignedUsers']); // Muat assignedUsers untuk ditampilkan di detail

        $user = Auth::user();
        // Jika user bukan admin/manajer proyek, filter tugas
        if (!$user->hasRole('admin') && !$user->hasRole('manajer proyek')) {
            $project->setRelation('tasks', $project->tasks->filter(function($task) use ($user, $project) {
                // User bisa melihat tugas jika tugas ditugaskan padanya ATAU
                // jika dia adalah anggota tim yang ditugaskan ke proyek ini
                return $user->id === $task->user_id || $project->assignedUsers->contains($user->id);
            }));
        }

        // Kirim juga daftar semua user ke frontend untuk form penugasan di halaman show
        $allUsers = User::select('id', 'name')->get();

        return Inertia::render('Project/Task/Show', [
            'project' => $project,
            'allUsers' => $allUsers, // Kirim daftar semua user
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit($id) // Menggunakan $id sesuai rute
    {
        $project = Project::findOrFail($id); // Cari project secara manual
        Gate::authorize('update', $project); // Otorisasi: Hanya yang diizinkan policy yang bisa update

        $project->load('assignedUsers'); // Muat assigned users untuk form edit
        $allUsers = User::select('id', 'name')->get(); // Ambil semua user untuk dropdown penugasan

        return Inertia::render('Project/Edit', [
            'project' => $project,
            'allUsers' => $allUsers, // Kirim daftar semua user
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, $id) // Menggunakan $id sesuai rute
    {
        $project = Project::findOrFail($id); // Cari project secara manual
        Gate::authorize('update', $project); // Otorisasi

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil diperbarui!');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy($id) // Menggunakan $id sesuai rute
    {
        $project = Project::findOrFail($id); // Cari project secara manual
        Gate::authorize('delete', $project); // Otorisasi

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus!');
    }

    /**
     * Update the status of a project.
     */
    public function updateStatus(Request $request, Project $project) // Menggunakan Route Model Binding ($project)
    {
        Gate::authorize('updateStatus', $project); // Otorisasi: Hanya admin yang bisa update status

        $request->validate([
            'status' => ['required', 'in:progress,completed'],
        ]);

        Log::info('Updating project status', [
            'project_id' => $project->id,
            'old_status' => $project->status,
            'new_status' => $request->status,
            'user_id' => Auth::id()
        ]);

        try {
            $project->update([
                'status' => $request->status
            ]);

            $project->refresh(); // Refresh model untuk mendapatkan status terbaru

            Log::info('Project status updated successfully', [
                'project_id' => $project->id,
                'current_status' => $project->status
            ]);

            return redirect()->route('projects.index')->with([
                'success' => 'Status proyek berhasil diubah menjadi ' .
                             ($request->status === 'completed' ? 'Selesai' : 'Dalam Progress'),
                'updated_project_id' => $project->id,
                'new_status' => $project->status
            ]);
        } catch (\Exception $e) {
            Log::error('Database error during project status update:', [
                'project_id' => $project->id,
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->withErrors(['status_update' => 'Gagal mengubah status proyek: ' . $e->getMessage()]);
        }
    }

    /**
     * Sync assigned users to a project.
     */
    public function assignUsers(Request $request, $id) // Menggunakan $id sesuai rute
    {
        $project = Project::findOrFail($id); // Cari project secara manual
        Gate::authorize('update', $project); // Otorisasi: Menggunakan policy 'update' sebagai contoh otorisasi

        $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'integer|exists:users,id', // Pastikan ID adalah integer dan ada di tabel users
        ]);

        // Gunakan sync() untuk menugaskan user. Ini akan melepaskan user yang tidak dipilih
        // dan menugaskan user yang baru dipilih.
        $project->assignedUsers()->sync($request->user_ids);

        return redirect()->route('projects.show', $project->id)->with('success', 'Anggota tim berhasil ditugaskan!');
    }
}