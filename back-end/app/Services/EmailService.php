<?php

namespace App\Services;

use App\Mail\confirmationMail;
use App\Mail\reset_password_mail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    // confirmation account 
    public function confirme_acount(  $confirmationToken , User $user)
    {
        Mail::to($user->email)->send(new confirmationMail($confirmationToken,$user));
    }
    // for reset password
    public function send_reset_pass_code($email , $code)  {
        Mail::to($email)->send(new  reset_password_mail($email , $code));
    }
}