<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    // Admin dan Manajer Proyek selalu bisa melihat/mengedit semua tugas
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin') || $user->hasRole('manajer proyek')) {
            return true; // Admin dan Manajer Proyek bypass semua cek policy ini
        }

        return null; // Lanjutkan ke policy method yang spesifik
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->id !== null; // Semua user yang login bisa melihat tugas (miliknya atau di proyeknya)
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        // User bisa melihat tugas jika:
        // 1. Tugas ditugaskan padanya
        // 2. Dia ditugaskan ke proyek tempat tugas itu berada
        // 3. Dia adalah pembuat proyek
        return $user->id === $task->user_id ||
               $task->project->assignedUsers->contains($user->id) ||
               $user->id === $task->project->user_id; // Pembuat proyek
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project $project): bool
    {
        // Hanya Admin, Manajer Proyek, atau anggota tim yang ditugaskan ke proyek
        // yang bisa membuat tugas di proyek itu.
        return $user->hasRole('admin') ||
               $user->hasRole('manajer proyek') ||
               $project->assignedUsers->contains($user->id);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // User bisa update tugas jika:
        // 1. Dia adalah Admin atau Manajer Proyek
        // 2. Tugas ditugaskan padanya
        // 3. Dia ditugaskan ke proyek tempat tugas itu berada
        return $user->hasRole('admin') ||
               $user->hasRole('manajer proyek') ||
               $user->id === $task->user_id ||
               $task->project->assignedUsers->contains($user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Hanya Admin atau Manajer Proyek yang bisa delete tugas
        // Atau pembuat proyek
        return $user->hasRole('admin') ||
               $user->hasRole('manajer proyek') ||
               $user->id === $task->project->user_id; // Pembuat proyek
    }
}