<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles; // Tambahkan ini jika Anda ingin relasi ke Task

class Project extends Model
{
    use HasFactory, HasRoles;

    protected $fillable = [
        'name',
        'description',
        'user_id', // <<< PASTIKAN INI ADA DI SINI
        'status',
    ];

    /**
     * Get the user that owns the project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany // <<< TAMBAHKAN METODE INI
    {
        return $this->hasMany(Task::class, 'projek_id'); // Pastikan 'projek_id' adalah nama kolom foreign key di tabel 'tasks'
    }

     public function assignedUsers(): BelongsToMany // <<< TAMBAHKAN METODE INI
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')->withTimestamps();
    }
}