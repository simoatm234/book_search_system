<?php

namespace App\Http\Controllers;

use App\Models\UserActions;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserActionsSevices;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class UserActionsController extends Controller
{
    use AuthorizesRequests;

    protected UserActionsSevices $user_actions;
    public function __construct(UserActionsSevices $user_actions)
    {
        $this->user_actions  = $user_actions;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = auth()->user();

            // Only admins can fetch all actions
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Fetch all actions with user info
            $actions = $this->user_actions->allAction();

            // Log this admin action
            UserActions::create([
                'user_id' => $user->id,
                'action' => 'fetch_all_actions',
                'description' => 'Admin fetched all user actions successfully',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'status' => 'success',
                'metadata' => [
                    'actions_count' => $actions->count(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'data' => $actions,
            ], 200);
        } catch (\Throwable $th) {

            // Log the failed attempt
            if (auth()->check()) {
                UserActions::create([
                    'user_id' => auth()->id(),
                    'action' => 'fetch_all_actions',
                    'description' => 'Admin failed to fetch user actions',
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'url' => request()->fullUrl(),
                    'method' => request()->method(),
                    'status' => 'failed',
                    'metadata' => [
                        'error_message' => $th->getMessage(),
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch actions',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

  

}
