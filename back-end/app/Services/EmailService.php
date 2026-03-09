<?php

namespace App\Services;

use App\Mail\confirmationMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function confirme_acount(  $confirmationToken , User $user)
    {
        Mail::to($user->email)->send(new confirmationMail($confirmationToken,$user));
    }
}