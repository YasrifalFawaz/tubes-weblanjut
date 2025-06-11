<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    // Admin dan Manajer Proyek selalu bisa melihat semua
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
        // Semua user yang login bisa melihat daftar proyek (setidaknya yang ditugaskan)
        return $user->id !== null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        // User bisa melihat proyek jika:
        // 1. Dia adalah pembuat proyek
        // 2. Dia ditugaskan ke proyek tersebut
        return $user->id === $project->user_id || $project->assignedUsers->contains($user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Hanya Admin dan Manajer Proyek yang bisa membuat proyek (sudah diatur oleh middleware 'role')
        // Policy ini hanya sebagai lapisan konfirmasi.
        return $user->hasRole('admin') || $user->hasRole('manajer proyek');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // Hanya Admin dan Manajer Proyek yang bisa update proyek
        // Atau pembuat proyek jika Anda mengizinkannya
        return $user->hasRole('admin') || $user->hasRole('manajer proyek'); // || $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can update the status of the model.
     */
    public function updateStatus(User $user, Project $project): bool
    {
        // Hanya Admin yang bisa update status proyek
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // Hanya Admin dan Manajer Proyek yang bisa delete proyek
        return $user->hasRole('admin') || $user->hasRole('manajer proyek');
    }
}