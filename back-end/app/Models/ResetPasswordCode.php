<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResetPasswordCode extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'confirmed',
        'updated',
        'expires_at',
        'ip_address'
    ];

    protected $casts = [
        'confirmed' => 'boolean',
        'updated' => 'boolean',
        'expires_at' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
