<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\confirmationMail;
use App\Models\ResetPasswordCode;
use App\Models\User;
use App\Services\EmailService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str ;


class EmailController extends Controller
{
    protected EmailService $email_service;
    public function __construct(EmailService $email_service)
    {
      $this->email_service = $email_service;
    }   


    // confirmation for acount first 
    public function Confirmation(Request $request)
    {
        //  validate request
        $validator = $request->validate([
            'token' => 'required|string',
        ]);
        if (!$validator) {
            return response()->json([
                'success' => false,
                'message' => 'Token is required'
            ], 422);
        }
        // find user
        $user = User::where('remember_token', $request->token)->first();
        // check user exist
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired confirmation token.'
            ], 400);
        }
        // check if alredy verified
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.'
            ], 400);
        }
        // check token exired
        if(Carbon::now() > $user->token_expires_at ){
            return response()->json([
                'success' => false,
                'message' => 'Token expired. Please request a new confirmation email.',
            ], 400);
        }
        //update user info
        $user->email_verified_at = Carbon::now();
        $user->remember_token = null;
        $user->confirmed = 1;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Email confirmed successfully!',
        ]);
    }
    //  if token was expired
    public function resendConfirmation(Request $request)
    {
        // validate data
        $validator = $request->validate( [
            'email' => 'required|email|exists:users,email',
        ]);

        if (!$validator) {
            return response()->json([
                'success' => false,
                'message' => 'Valid email is required',
            ], 422);
        }
        // find user
        $user = User::where('email', $request->email)->first();
        // check if lready verified.
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.'
            ], 400);
        }
        
        // Generate new token
        $token =  Str::random(60);
        $user->update([
            'remember_token' => $token,
            'token_expires_at' => Carbon::now()->addHours(24)
        ]);

        // Resend email
       $this->email_service->confirme_acount($token , $user);

        return response()->json([
            'success' => true,
            'message' => 'Confirmation email resent successfully.'
        ]);
    }





    // confirmation code for reset password
    // send code
    public function send_reset_code(Request $request)  {
        //  validate data 
        $validator = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);
        $user = User::where('email', $validator['email'])->first();

        $code = rand(100000, 999999); // 6-digit code

        ResetPasswordCode::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code' => $code,
                'confirmed' => false,
                'updated' => false,
                'expires_at' => Carbon::now()->addMinutes(3),
                'ip_address' => $request->ip(),
                'updated_at' => Carbon::now(),
            ]
        );
        $this->email_service->send_reset_pass_code($validator['email'] , $code);

        return response()->json([
            'success' => true,
            'message' => 'Reset code generated'
        ]);
    }
    // confirm code 

    public function confirme_code_reset_pass(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required'
        ]);
        $user = User::where('email', $validated['email'])->first();
        $record = ResetPasswordCode::where('user_id', $user->id)
            ->where('code', $validated['code'])
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid code'
            ], 401);
        }

        // already verified
        if ($record->confirmed) {
            return response()->json([
                'success' => false,
                'message' => 'Code already verified'
            ], 400);
        }

        // token expired
        if ($record->expires_at->isPast()) {
            return response()->json(['success' => false, 'message' => 'Token expired'], 400);
        }

        // update confirmation
        $record->confirmed = true ;
        $record->save();

        return response()->json([
            'success' => true,
            'message' => 'Code verified'
        ]);
    }
}
