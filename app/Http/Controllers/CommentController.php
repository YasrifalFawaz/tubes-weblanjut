<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Log; // Log tidak digunakan, bisa dihapus jika tidak ada di tempat lain

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage for a specific task.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Task $task)
    {
        Gate::authorize('create', Comment::class); // Policy check

        try {
            // Validasi input, termasuk file attachment
            $request->validate([
                'content' => 'required|string|max:1000',
                'attachment' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,zip|max:2048', // Validasi file
            ]);

            $attachmentPath = null;
            // Cek apakah ada file yang dilampirkan dalam request
            if ($request->hasFile('attachment')) {
                // Simpan file ke direktori 'comments_attachments' di dalam storage/app/public
                $attachmentPath = $request->file('attachment')->store('comments_attachments', 'public');
            }

            // Membuat komentar baru
            $comment = $task->comments()->create([
                'user_id' => Auth::id(), // User yang sedang login adalah pembuat komentar
                'content' => $request->content,
                'attachment_path' => $attachmentPath, // Simpan path file yang sudah di-generate
            ]);

            // Mengarahkan kembali ke halaman sebelumnya (detail proyek) dengan pesan sukses
            return redirect()->back()->with('success', 'Komentar berhasil ditambahkan!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Mengirim error validasi kembali ke frontend Inertia
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Mengarahkan kembali dengan pesan error umum jika terjadi Exception lain
            return redirect()->back()->withErrors(['general_error' => 'Terjadi kesalahan server saat menambahkan komentar.']);
        }
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Comment $comment)
    {
        Gate::authorize('delete', $comment); // Policy check

        // Opsional: Hapus file attachment dari storage jika ada
        if ($comment->attachment_path) {
            Storage::disk('public')->delete($comment->attachment_path);
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Komentar berhasil dihapus!');
    }
}