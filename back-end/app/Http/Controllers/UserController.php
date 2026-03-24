<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\updatePassRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\EmailService;
use App\Services\UserServices;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    use AuthorizesRequests ;
    protected UserServices $userService;
    protected EmailService $email_service;

    public function __construct(UserServices $userServices,EmailService $email_service)
    {
        $this->userService = $userServices;
        $this->email_service = $email_service;
    }

    /**
     * Display users list
     */
    public function index()
    {
        try {

            $users = $this->userService->AllUsers();
            

            return response()->json([
                'success' => true,
                'data' => $users
            ],200);
        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    public function indexTrashedUsers()
    {
        try {
            $users = $this->userService->AllUsersTrashed();
          
            return response()->json([
                'success' => true,
                'data' => $users
            ],200);
        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Store user
     */
    public function store(StoreUserRequest $request)
    {
        try {
            // validate data
            $data = $request->validated();
            // generate token 
            $token = Str::random(60);
            $data['remember_token'] = $token;
            $data['token_expires_at'] = Carbon::now()->addHours(24);
            // create user 
            $user = $this->userService->storeUser($data);
            // send email
            $this->email_service->confirme_acount($token, $user);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully please check your email to active your acount '
            ], 201);
        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Show user
     */
    public function show(User $user)
    {
        try {
            // Load userBooks relationship
            $user->load('userBooks');

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        } catch (\Throwable $th) {
            \Log::error('Error fetching user: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Update user
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {

             $this->authorize('update', $user);

            $data = $request->validated();

            $updatedUser = $this->userService->update($user, $data);

            return response()->json([
                'success' => true,
                'data' => $updatedUser,
                'message' => 'User updated successfully'
            ]);
        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Update failed',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    public function updatePass(UpdatePassRequest $request, User $user)
    {
        try {
            // Authorize the user
            $this->authorize('update', $user);

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                    'status' => false,
                ], 422);
            }

            // Prevent using same password
            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'message' => 'New password cannot be the same as current password',
                    'status' => false,
                ], 422);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            return response()->json([
                'message' => 'Password updated successfully',
                'success' => true,
                'data' => $user,
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'You are not authorized to update this password',
                'status' => false,
            ], 403);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'An error occurred while updating password',
                'status' => false,
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        try {
            // Find user including soft-deleted ones
            $user = $this->userService->findUser($id);

            // Authorize the force delete action
            $this->authorize('forceDelete', $user);

            // Force delete the user (permanently remove from database)
            $user->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'User permanently deleted successfully',
                'id' => $id
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this user'
            ], 403);
        } catch (\Throwable $th) {
            \Log::error('Force delete failed: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Delete failed',
                'error' => config('app.debug') ? $th->getMessage() : null
            ], 500);
        }
    }
    /**
     * Soft delete user (keeps record)
     */
    public function softDelete($id)
    {
        try {
            // Find user including soft-deleted ones
            $user = $this->userService->findUser($id);

            $this->authorize('delete', $user);

            $this->userService->deleteUser($user);

            return response()->json([
                'success' => true,
                'message' => 'User deactivated successfully',
                'id' => $user->id
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate user',
            ], 500);
        }
    }

    /**
     * Restore soft-deleted user
     */
    public function restore($id)
    {
        try {
            //  find soft-deleted users
            $user = $this->userService->findUserTrashed($id);

            $this->authorize('restore', $user);

            $user->restore();

            return response()->json([
                'success' => true,
                'message' => 'User restored successfully',
                'data' => $user
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Deleted user not found with ID: ' . $id
            ], 404);
        } catch (\Throwable $th) {
            \Log::error('Restore failed: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to restore user'
            ], 500);
        }
    }
}
