<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'projek_id',
        'status',
    ];

    /**
     * Get the user that is assigned to the task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the project that the task belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'projek_id'); // Foreign key 'projek_id'
    }
}