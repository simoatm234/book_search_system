<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = [
        'title',
        'summaries',
        'authors',
        'translators',
        'bookshelves',
        'subjects',
        'languages',
        'media_type',
        'gutendex_id',
        'download_count',
        'formats',
    ];

    protected $casts = [
        'authors' => 'array',
        'translators' => 'array',
        'bookshelves' => 'array',
        'subjects' => 'array',
        'languages' => 'array',
        'formats' => 'array',
    ];

    /**
     * Relation with book_files table
     * Each book can have multiple files (PDFs)
     */
    public function files()
    {
        return $this->hasMany(book_files::class, 'book_id', 'id');
    }
}
