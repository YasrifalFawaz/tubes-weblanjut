<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Bisa diaktifkan jika menggunakan verifikasi email
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; // Pastikan ini diimpor untuk Spatie Laravel-Permission

/**
 * @mixin \Spatie\Permission\Traits\HasRoles // <--- Tambahkan baris ini untuk membantu IDE (Intelephense)
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles; // Pastikan HasRoles ada di sini

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Jika Anda memiliki kolom tambahan di tabel 'users' untuk peran
    // dan tidak menggunakan Spatie, Anda mungkin memiliki sesuatu seperti:
    // protected $casts = [
    //     'roles' => 'array', // Jika menyimpan peran sebagai JSON array
    // ];
    // Atau jika hanya satu peran:
    // protected $fillable = [..., 'role'];

    // Jika Anda ingin menambahkan method kustom, Anda bisa menuliskannya di sini
    // public function isAdmin(): bool
    // {
    //     return $this->hasRole('admin');
    // }
}