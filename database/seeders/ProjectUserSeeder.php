<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;    // Impor model User untuk mengambil data user
use App\Models\Project; // Impor model Project untuk mengambil data proyek

class ProjectUserSeeder extends Seeder
{
    /**
     * Jalankan database seeds.
     *
     * @return void
     */
    public function run()
    {
        $yasrifal = User::where('name', 'yasrifal')->first();
        $fadhlan = User::where('name', 'fadhlan')->first();
        $nouval = User::where('name', 'nouval')->first();
        $ilham = User::where('name', 'ilham')->first();


        $pemogramanWebLanjutProject = Project::where('name', 'Pemograman Web Lanjut')->first();

        if (!$yasrifal) {
            $this->command->error("User 'yasrifal' tidak ditemukan. Pastikan UserSeeder telah dijalankan atau user ini ada di database.");
            return; // Hentikan seeder jika data tidak ditemukan
        }
        if (!$fadhlan) {
            $this->command->error("User 'fadhlan' tidak ditemukan. Pastikan UserSeeder telah dijalankan atau user ini ada di database.");
            return;
        }
        if (!$nouval) {
            $this->command->error("User 'nouval' tidak ditemukan. Pastikan UserSeeder telah dijalankan atau user ini ada di database.");
            return;
        }
        if (!$ilham) {
            $this->command->error("User 'ilham' tidak ditemukan. Pastikan UserSeeder telah dijalankan atau user ini ada di database.");
            return;
        }
        if (!$pemogramanWebLanjutProject) {
            $this->command->error("Proyek 'Pemograman Web Lanjut' tidak ditemukan. Pastikan ProjectSeeder telah dijalankan atau proyek ini ada di database.");
            return;
        }

        DB::table('project_user')->insertOrIgnore([
            'project_id' => $pemogramanWebLanjutProject->id,
            'user_id' => $yasrifal->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('project_user')->insertOrIgnore([
            'project_id' => $pemogramanWebLanjutProject->id,
            'user_id' => $fadhlan->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('project_user')->insertOrIgnore([
            'project_id' => $pemogramanWebLanjutProject->id,
            'user_id' => $nouval->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('project_user')->insertOrIgnore([
            'project_id' => $pemogramanWebLanjutProject->id,
            'user_id' => $ilham->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}