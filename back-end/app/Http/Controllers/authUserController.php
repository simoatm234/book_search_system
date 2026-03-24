<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\ResetPasswordCode;
use App\Models\User;
use App\Services\UserActionsSevices;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class authUserController extends Controller
{
    use AuthorizesRequests;
    protected UserActionsSevices $user_actions;
    public function __construct(UserActionsSevices $user_actions)
    {
        $this->user_actions  = $user_actions;
    }

    // public function me(Request $request)
    // {
    //     try {
    //         $user = $request->user();

    //         if (!$user) {
    //             return response()->json([
    //                 'message' => 'User not authenticated'
    //             ], 401);
    //         }

    //         return response()->json([
    //             'user' => $user
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to fetch user',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

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
        // if ($user->is_auth) {
        //             return response()->json(
        //                 [
        //                     'message' => 'Your account alredy loged from outher device ',
        //                     'reason' => $user->is_auth
        //                 ], 403);
        // }
        //revoke old tocen 
        $user->tokens()->delete();
        //create a new token 
        $token = $user->createToken('auth_token' . now()->timestamp)->plainTextToken;
        //update auth section
        $user->is_auth = true;
        $user->last_login_at = Carbon::now();
        $user->save();
            //store action
            $this->user_actions->makeAction($user,'login', 'Login successful' ,[]);
            //response
            return response()->json([
            'success' => true,
            'message' => 'user logged in successfully',
            'data' => $user,
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
                $this->user_actions->makeAction(
                    $user,
                    ' logout',
                    'Failed to logout',
                    ['reason' => 'duplicate  login'],
                    'failed' 
                );
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
            //store action
            $this->user_actions->makeAction($user, 'logout', 'logout successful', []);
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
        $validated = $request->validate([
            'email' => 'required|email'
        ]);
        $user = User::where('email' , $validated['email'])->first();
        if(!$user){
            return response()->json([
                'success' => false,
                'message' => 'Email not found'
            ], 401);}
        return response()->json([
            'success' => true,
            'message' => 'Email exists'
        ], 200);
    }

    public function resetPassword(Request $request)
    {
       try {
            $validated = $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string|min:6|confirmed',
                'code' => 'required'
            ]);
            $user = User::where('email', $validated['email'])->first();

            // Find the specific reset record
            $record = ResetPasswordCode::where('user_id', $user->id)
                ->where('code', $validated['code'])
                ->where('updated', 0)
                ->first();

            if (!$record) {
                $this->user_actions->makeAction(
                    $user,
                    'reset password',
                    'Failed to reset password',
                    ['reason' => 'Invalid code'],
                    'failed' 
                );
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid code'
                ], 401);
            }

            if (!$record->confirmed) {
                $this->user_actions->makeAction(
                    $user,
                    'reset password',
                    'Failed to reset password',
                    ['reason' => 'confirmation'],
                    'failed' // optional status parameter
                );
                return response()->json([
                    'success' => false,
                    'message' => 'Please verify your code first'
                ], 400);
            }

            // Update user's password
            $user->password = Hash::make($validated['password']);
            $user->save();

            // Mark only this reset record as updated
            $record->update(['updated' => 1]);
            //store action
            $this->user_actions->makeAction($user, 'reset password', 'password reseted successful', []);

            return response()->json([
                'success' => true,
                'message' => 'Password successfully reset'
            ]);
       } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => ' failed to reset password',
                'error' => $th->getMessage()
            ], 500);
       }
    }
}
