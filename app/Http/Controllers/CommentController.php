<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task; // Impor model Task
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage for a specific task.
     * Handles POST /tasks/{task}/comments
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task  The task the comment belongs to (Route Model Binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Task $task)
    {
        Gate::authorize('create', Comment::class); // Authorize creating any comment (user must be logged in)

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $task->comments()->create([ // Buat komentar terkait tugas
            'user_id' => Auth::id(), // User yang sedang login adalah pembuat komentar
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Komentar berhasil ditambahkan!');
    }

    /**
     * Remove the specified comment from storage.
     * Handles DELETE /comments/{comment}
     *
     * @param  \App\Models\Comment  $comment The comment to delete (Route Model Binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Comment $comment)
    {
        Gate::authorize('delete', $comment); // Authorize deleting this comment

        $comment->delete();

        return redirect()->back()->with('success', 'Komentar berhasil dihapus!');
    }
}