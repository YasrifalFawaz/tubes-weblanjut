<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'content',
        'attachment_path',
    ];

    /**
     * Get the user that owns the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the task that the comment belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function getAttachmentUrlAttribute(): ?string
    {
        // Jika attachment_path ada, buat URL publiknya
        return $this->attachment_path ? Storage::url($this->attachment_path) : null;
    }
}