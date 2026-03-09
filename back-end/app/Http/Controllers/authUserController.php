<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class authUserController extends Controller
{
    use AuthorizesRequests;
    
    public function login(LoginRequest $request)  {
        try {
        //validate data 
        $validateData = $request->validated();
        //find user 
        $user = User::where('email', $validateData['email'])->first();
        if (!$user) {
            return response()->json([
                'message' => 'user not found',
                'errors' => 'No account exists with this email.'
            ], 404);
        }
        //check hach pass
        if (!Hash::check($validateData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid password',
                'errors' => 'The provided password is incorrect.'
            ], 401);
        }
        //check acount confirmation
        if (!$user->confirmed) {
            return response()->json([
                'message' => 'please confirm your acount',
                'errors' => ' account inconfirmed'
            ], 404);
        }
        //check if user alredy auth right now 
        if ($user->is_auth) {
                    return response()->json(
                        [
                            'message' => 'Your account alredy loged from outher device ',
                            'reason' => $user->is_auth
                        ], 403);
        }
        //revoke old tocen 
        $user->tokens()->delete();
        //create a new token 
        $token = $user->createToken('auth_token' . now()->timestamp)->plainTextToken;
        //update auth section
        $user->is_auth = true;
        $user->last_login_at = Carbon::now();
        $user->save();
        //response
        return response()->json([
            'message' => 'user logged in successfully',
            'admin' => $user->id,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'login failed',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    public function logout(User $user)  {
        try {
            //policy check 
             $this->authorize('logout' ,$user);
             //check user if alredy logout
            if (!$user->is_auth) {
                return response()->json(
                    [
                        'message' => 'Your account alredy logedout  ',
                        'reason' => $user->is_auth
                    ],
                    403
                );
            }
            //delete access token
            $token = $user->currentAccessToken();

            if ($token) {
                $token->delete();
            } else {
                // Log this for debugging
                \Log::warning('Logout attempted with no current token for user: ' . $user->id);
            }
            
            //update is_auth
            $user->is_auth = false;
            $user->last_logout_at = Carbon::now();
            $user->save();
            //response
            return response()->json([
                'message' => 'user logout in successfully',
                'token_type' => 'Bearer'
            ], 200);
            
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'logout failed',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    public function check_email(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Email exists'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
            'token' => 'required'
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])->where('token' , $validated['token'])
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid code'
            ], 401);
        }

        if (!$record->confirmed) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your code first'
            ], 400);
        }
        if ($record->updated) {
            return response()->json([
                'success' => false,
                'message' => 'password alredy reset with this code '
            ], 400);
        }

        // Update the user's password
        $user = User::where('email', $validated['email'])->first();
        $user->password = Hash::make($validated['password']);
        $user->save();
        // update in password reset tabel
        DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->update(['updated' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'Password successfully reset'
        ]);
    }
}
