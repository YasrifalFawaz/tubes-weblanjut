<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project; // Untuk store method
use App\Models\User; // Import User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate; // Untuk Policy
use Inertia\Inertia; // Import Inertia facade

class TaskController extends Controller
{


    /**
     * Store a newly created task in storage for a specific project.
     */
    public function store(Request $request, Project $project) // Terima Project sebagai parameter
    {
        Gate::authorize('create', [Task::class, $project]); // Authorize creating task for this project

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id', // User yang akan ditugaskan ke task
            'status' => 'required|in:to_do,in_progress,finished',
        ]);

        $task = $project->tasks()->create([ // Buat tugas terkait proyek
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $request->user_id,
            'status' => $request->status,
            'projek_id' => $project->id, // Pastikan projek_id terisi dengan benar
        ]);

        return redirect()->back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Task $task) // Terima Task sebagai parameter
    {
        Gate::authorize('update', $task); // Authorize updating this task

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:to_do,in_progress,finished',
        ]);

        $task->update([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $request->user_id,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Tugas berhasil diperbarui!');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task) // Terima Task sebagai parameter
    {
        Gate::authorize('delete', $task); // Authorize deleting this task

        $task->delete();

        return redirect()->back()->with('success', 'Tugas berhasil dihapus!');
    }

    /**
     * Update the status of a specific task (used by drag-and-drop or status buttons).
     */
    public function updateStatus(Request $request, Task $task)
    {
        Gate::authorize('update', $task); // Authorize update task

        $request->validate([
            'status' => ['required', 'in:to_do,in_progress,finished'],
        ]);

        $task->update([
            'status' => $request->status
        ]);

    }
}