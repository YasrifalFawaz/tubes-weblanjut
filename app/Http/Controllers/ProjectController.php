<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

    /** ✅ Hapus proyek */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus!');
    }

    /** ✅ Update status proyek - DIPERBAIKI */
    public function updateStatus(Request $request, $id)
    {
        // Validasi input status
        $request->validate([
            'status' => 'required|in:progress,completed'
        ]);

        $project = Project::findOrFail($id);
        
        // Update status dengan nilai dari request
        $project->update([
            'status' => $request->status
        ]);

        // Log untuk debugging (opsional)
        \Log::info("Project {$project->id} status updated to: {$request->status}");

        return redirect()->route('projects.index')->with('success', 'Status proyek berhasil diperbarui!');
    }
}