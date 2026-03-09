<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\confirmationMail;
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
        // Generate access token for auto-login 
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Email confirmed successfully!',
            'data' => [
                'user' => $user->only(['id', 'name', 'email']),
                'access_token' => $token,
                'token_type' => 'Bearer'
            ]
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
        $code = rand(100000, 999999); // 6-digit code

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $validator['email']],
            [
                'token' => $code,
                'expires_at' => Carbon::now()->addSecond(120) , 
                'created_at' => Carbon::now()
            ]
        );
        $data['token_expires_at'] = Carbon::now()->addHours(24);
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
            'token' => 'required'
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', $validated['token'])
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
        if ($record->expires_at < Carbon::now()) {
            return response()->json([
                'success' => false,
                'message' => 'Token expired, try again'
            ], 400);
        }

        // update confirmation
        DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->update(['confirmed' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'Code verified'
        ]);
    }
}
