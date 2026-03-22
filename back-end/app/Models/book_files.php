<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class book_files extends Model
{
    use HasFactory;
    protected $table = 'book_files';

    protected $fillable = [
        'book_id',
        'file_path',
        'file_format',
        'cover_path',
        'downloaded_at',
    ];

    protected $casts = [
        'downloaded_at' => 'datetime',
    ];

    /**
     * Relationship to Book
     */
    public function book()
    {
        return $this->belongsTo(book::class);
    }

    /**
     * Get full storage path
     */
    public function getFullPathAttribute()
    {
        return storage_path('app/' . $this->file_path);
    }

    /**
     * Get public URL (if storage:link is used)
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }
}
