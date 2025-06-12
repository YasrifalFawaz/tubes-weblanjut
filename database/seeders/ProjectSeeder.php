<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $yasrifal = User::where('name', 'yasrifal')->first();
        $fadhlan = User::where('name', 'fadhlan')->first();
        $nouval = User::where('name', 'nouval')->first();
        $ilham = User::where('name', 'ilham')->first();

        $project = Project::create([
            'name' => 'Pemograman Web Lanjut',
            'description' => 'Pemograman Web Lanjut',
            'user_id' => 2,
            'status' => 'progress'
        ]);

        $project->tasks()->create([
            'name' => 'Manage User',
            'description' => 'Membuat Manajemen User',
            'user_id' => $fadhlan->id,
            'status' => 'to_do'
        ]);
        $project->tasks()->create([
            'name' => 'CRUD Comment',
            'description' => 'Membuat CRUD Comment',
            'user_id' => $yasrifal->id,
            'status' => 'in_progress'
        ]);
        $project->tasks()->create([
            'name' => 'CRUD Task',
            'description' => 'Membuat CRUD Task',
            'user_id' => $ilham->id,
            'status' => 'to_do'
        ]);
        $project->tasks()->create([
            'name' => 'Profile Update',
            'description' => 'Membuat Pengupdatean Profile',
            'user_id' => $fadhlan->id,
            'status' => 'in_progress'
        ]);
        $project->tasks()->create([
            'name' => 'Implementasi API',
            'description' => 'Membuat API dan Documentasi API dengan Swagger',
            'user_id' => $nouval->id,
            'status' => 'finished'
        ]);
        $project->tasks()->create([
            'name' => 'File Attachment',
            'description' => 'Menambahkan File Attachment pada Comment',
            'user_id' => $yasrifal->id,
            'status' => 'in_progress'
        ]);
        $project->tasks()->create([
            'name' => 'Membuat Autentikasi',
            'description' => 'Membuat Login dan Register',
            'user_id' => $yasrifal->id,
            'status' => 'to_do'
        ]);
        $project->tasks()->create([
            'name' => 'Menambahkan Permission',
            'description' => 'Menambahkan Permission pada Halaman Tertentu',
            'user_id' => $fadhlan->id,
            'status' => 'finished'
        ]);
        $project->tasks()->create([
            'name' => 'Membuat Dashboard',
            'description' => 'Menambahkan Visualisasi Proyek dengan ChatJS pada halaman Dashboard',
            'user_id' => $ilham->id,
            'status' => 'finished'
        ]);
        $project->tasks()->create([
            'name' => 'Update Status Proyek',
            'description' => 'Mengupdate Status Proyek',
            'user_id' => $nouval->id,
            'status' => 'to_do'
        ]);
    }
}
