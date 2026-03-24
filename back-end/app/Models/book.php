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
        'reading_count',
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
        return $this->hasOne(book_files::class)->latestOfMany();
    }
    public function UserBook()
    {
        return $this->hasMany(UserBook::class);
    }
   
   
}
