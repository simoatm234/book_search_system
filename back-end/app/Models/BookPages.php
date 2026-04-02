<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookPages extends Model
{
use HasFactory;

protected $table = 'book_pages';

protected $fillable = [
'book_id',
'page_number',
'content'
];

protected $casts = [
'page_number' => 'integer',
];

public function book()
{
return $this->belongsTo(Book::class);
}
}