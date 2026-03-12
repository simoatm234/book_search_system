<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActions extends Model
{
    use HasFactory;

    protected $table = 'user_actions';

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'url',
        'method',
        'status',
        'metadata',
    ];

    // Cast metadata JSON to array
    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * The user that owns this action.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
