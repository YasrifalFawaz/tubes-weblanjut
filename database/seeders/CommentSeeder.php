<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = Task::all();
        $users = User::all();

        // Komentar ini hanya Dummy
        $comments = [
            [
                'content' => 'Nanti saya kerjakan.',
                'user_id' => $users->where('name', 'fadhlan')->first()->id,
                'task_id' => $tasks->where('name', 'Manage User')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Masih ada error, akan saya perbaiki.',
                'user_id' => $users->where('name', 'yasrifal')->first()->id,
                'task_id' => $tasks->where('name', 'CRUD Comment')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Akan segera saya mulai pengerjaan.',
                'user_id' => $users->where('name', 'ilham')->first()->id,
                'task_id' => $tasks->where('name', 'CRUD Task')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Ada error, saya kerjakan yang lain dulu.',
                'user_id' => $users->where('name', 'fadhlan')->first()->id,
                'task_id' => $tasks->where('name', 'Profile Update')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Sudah berhasil, silahkan dicek.',
                'user_id' => $users->where('name', 'nouval')->first()->id,
                'task_id' => $tasks->where('name', 'Implementasi API')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Ada sedikit error, segera saya perbaiki.',
                'user_id' => $users->where('name', 'yasrifal')->first()->id,
                'task_id' => $tasks->where('name', 'File Attachment')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Sudah berhasil, silahkan dicek.',
                'user_id' => $users->where('name', 'yasrifal')->first()->id,
                'task_id' => $tasks->where('name', 'Membuat Autentikasi')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Sudah berhasil, silahkan dicek.',
                'user_id' => $users->where('name', 'fadhlan')->first()->id,
                'task_id' => $tasks->where('name', 'Menambahkan Permission')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Sudah berhasil, silahkan dicek.',
                'user_id' => $users->where('name', 'nouval')->first()->id,
                'task_id' => $tasks->where('name', 'Membuat Dashboard')->first()->id,
                'attachment_path' => null,
            ],
            [
                'content' => 'Akan saya kerjakan secepatnya.',
                'user_id' => $users->where('name', 'nouval')->first()->id,
                'task_id' => $tasks->where('name', 'Update Status Proyek')->first()->id,
                'attachment_path' => null,
            ],
        ];

        foreach ($comments as $commentData) {
            Comment::create($commentData);
        }
    }
}
