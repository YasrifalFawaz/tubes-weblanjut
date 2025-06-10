<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('user')->get();

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Project/Create');
    }

    public function store(Request $request)
    {
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

    public function edit($id)
    {
        $project = Project::findOrFail($id);
        $this->authorize('update', $project); // Policy check
        return Inertia::render('Project/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = Project::findOrFail($id);
        $project->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus!');
    }

    /**
     * Update status proyek - DIPERBAIKI dengan logging
     */
    public function updateStatus(Request $request, Project $project)
    {
        // Validasi input
        $request->validate([
            'status' => 'required|in:progress,completed',
        ]);

        // Log untuk debugging
        Log::info('Updating project status', [
            'project_id' => $project->id,
            'old_status' => $project->status,
            'new_status' => $request->status,
            'user_id' => Auth::id()
        ]);

        // Update status
        $project->update([
            'status' => $request->status
        ]);

        // Verify update
        $project->refresh();
        
        Log::info('Project status updated successfully', [
            'project_id' => $project->id,
            'current_status' => $project->status
        ]);

        // Return dengan fresh data - KUNCI UTAMA
        return redirect()->route('projects.index')->with([
            'success' => 'Status proyek berhasil diubah menjadi ' . 
                        ($request->status === 'completed' ? 'Selesai' : 'Dalam Progress'),
            'updated_project_id' => $project->id,
            'new_status' => $project->status
        ]);
    }
}