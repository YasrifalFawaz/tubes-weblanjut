<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
        ]);
        $admin->assignRole('admin');

        $manager = User::create([
            'name' => 'Manajer Proyek',
            'email' => 'manager@manager.com',
            'password' => Hash::make('manager123'),
        ]);
        $manager->assignRole('manajer proyek');
        
        $teammember = User::create([
            'name' => 'Team Member',
            'email' => 'member@gmail.com',
            'password' => Hash::make('12345678'),
        ]);
        $teammember->assignRole('anggota tim');

        $yasrifal = User::create([
            'name' => 'yasrifal',
            'email' => 'yasrifal@gmail.com',
            'password' => Hash::make('yasrifal123'),
        ]);
        $yasrifal->assignRole('anggota tim');

        $fadhlan = User::create([
            'name' => 'fadhlan',
            'email' => 'fadhlan@gmail.com',
            'password' => Hash::make('fadhlan123'),
        ]);
        $fadhlan->assignRole('anggota tim');
        
        $nouval = User::create([
            'name' => 'nouval',
            'email' => 'nouval@gmail.com',
            'password' => Hash::make('nouval123'),
        ]);
        $nouval->assignRole('anggota tim');

        $ilham = User::create([
            'name' => 'ilham',
            'email' => 'ilham@gmail.com',
            'password' => Hash::make('ilham123'),
        ]);
        $ilham->assignRole('anggota tim');
    }
}