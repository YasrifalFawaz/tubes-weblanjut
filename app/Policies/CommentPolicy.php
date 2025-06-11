<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Comment;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    // Admin dan Manajer Proyek selalu bisa
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin') || $user->hasRole('manajer proyek')) {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // User bisa membuat komentar jika dia login
        return $user->id !== null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Comment $comment): bool
    {
        // User bisa melihat komentar jika:
        // 1. Dia adalah admin/manajer proyek (ditangani by before)
        // 2. Dia adalah pembuat komentar
        // 3. Dia ditugaskan ke proyek tempat tugas berada
        return $user->id === $comment->user_id ||
               $comment->task->project->assignedUsers->contains($user->id) ||
               $user->id === $comment->task->project->user_id; // Pembuat proyek
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Comment $comment): bool
    {
        // User bisa update komentar jika dia pembuatnya
        return $user->id === $comment->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Comment $comment): bool
    {
        // User bisa delete komentar jika dia pembuatnya, atau admin/manajer proyek
        return $user->id === $comment->user_id ||
               $user->hasRole('admin') ||
               $user->hasRole('manajer proyek');
    }
}