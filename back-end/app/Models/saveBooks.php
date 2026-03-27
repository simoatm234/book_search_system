<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class saveBooks extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'book_id'];

    public $timestamps = true;

    /**
     * Get the user that owns this saved book record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book associated with this saved record.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
