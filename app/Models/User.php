<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Bisa diaktifkan jika menggunakan verifikasi email
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; 
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany; // Untuk proyek yang dibuat
use Illuminate\Database\Eloquent\Relations\BelongsToMany;// Pastikan ini diimpor untuk Spatie Laravel-Permission

/**
 * @mixin \Spatie\Permission\Traits\HasRoles // <--- Tambahkan baris ini untuk membantu IDE (Intelephense)
 */
class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles; // Pastikan HasRoles ada di sini

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

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

    public function projectsCreated(): HasMany
    {
        return $this->hasMany(Project::class, 'user_id');
    }

     public function assignedProjects(): BelongsToMany // <<< TAMBAHKAN METODE INI
    {
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id')->withTimestamps();
    }

    public function tasksAssigned(): HasMany
    {
        return $this->hasMany(Task::class, 'user_id');
    }

}