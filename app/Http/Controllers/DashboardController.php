<?php

namespace App\Http\Controllers;

use App\Models\Project; // Impor model Project
use App\Models\Task;    // Impor model Task
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard with statistics.
     * Handles GET /dashboard
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $totalProjects = 0;
        $totalTasks = 0;
        $tasksToDo = 0;
        $tasksInProgress = 0;
        $tasksFinished = 0;

        // Logika untuk mengambil statistik berdasarkan peran
        if ($user->hasRole('admin')) {
            // Admin: Melihat semua statistik
            $totalProjects = Project::count();
            $totalTasks = Task::count();
            $tasksToDo = Task::where('status', 'to_do')->count();
            $tasksInProgress = Task::where('status', 'in_progress')->count();
            $tasksFinished = Task::where('status', 'finished')->count();
        } elseif ($user->hasRole('manajer proyek')) {
            // Manajer Proyek: Melihat proyek yang dia buat DAN yang ditugaskan kepadanya, beserta tugasnya
            $managedProjects = $user->projectsCreated()->pluck('id');
            $assignedProjects = $user->assignedProjects()->pluck('id');
            
            $allRelevantProjectIds = $managedProjects->merge($assignedProjects)->unique();

            $totalProjects = Project::whereIn('id', $allRelevantProjectIds)->count();
            $totalTasks = Task::whereIn('projek_id', $allRelevantProjectIds)->count();
            $tasksToDo = Task::whereIn('projek_id', $allRelevantProjectIds)->where('status', 'to_do')->count();
            $tasksInProgress = Task::whereIn('projek_id', $allRelevantProjectIds)->where('status', 'in_progress')->count();
            $tasksFinished = Task::whereIn('projek_id', $allRelevantProjectIds)->where('status', 'finished')->count();
        } elseif ($user->hasRole('anggota tim')) {
            // Anggota Tim: Hanya melihat proyek yang ditugaskan kepadanya dan tugas yang ditugaskan kepadanya
            $assignedProjects = $user->assignedProjects()->pluck('id');

            $totalProjects = Project::whereIn('id', $assignedProjects)->count();
            $totalTasks = Task::where('user_id', $user->id)->count(); // Hanya tugas yang ditugaskan kepadanya
            $tasksToDo = Task::where('user_id', $user->id)->where('status', 'to_do')->count();
            $tasksInProgress = Task::where('user_id', $user->id)->where('status', 'in_progress')->count();
            $tasksFinished = Task::where('user_id', $user->id)->where('status', 'finished')->count();
        }
        // Untuk role lain atau user tanpa role khusus, semua akan 0 (atau bisa diatur sesuai kebutuhan)

        return Inertia::render('Dashboard', [
            'totalProjects' => $totalProjects,
            'totalTasks' => $totalTasks,
            'tasksToDo' => $tasksToDo,
            'tasksInProgress' => $tasksInProgress,
            'tasksFinished' => $tasksFinished,
            // Properti 'auth' akan otomatis dikirim oleh HandleInertiaRequests
        ]);
    }
}