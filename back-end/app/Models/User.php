<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes , HasApiTokens;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'is_auth',
        'confirmed',
        'remember_token',
        'last_login_at',
        'last_logout_at',
        'token_expires_at' 
    ];

    /**
     * Hidden attributes
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    /**
     * Attribute casting
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'last_logout_at' => 'datetime',
            'token_expires_at' => 'datetime',
            'password' => 'hashed'
        ];
    }
    // rolations
    public function userActions()
    {
        return $this->belongsTo(UserActions::class);
    }
    public function resetCodes()
    {
        return $this->hasMany(ResetPasswordCode::class);
    }

    public function userBooks()
    {
        return $this->hasMany(UserBook::class);
    }
    
    public function savedBooks()
    {
        return $this->belongsToMany(Book::class, 'save_books', 'user_id', 'book_id')
            ->withTimestamps();
    }
}
