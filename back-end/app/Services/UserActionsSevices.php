<?php

namespace App\Services ;

use App\Models\UserActions;

class UserActionsSevices 
{
    public function allAction() {
        return  $actions = UserActions::with('user')->latest()->get();
    }
    public function makeAction($user, string $action, ?string $description = null, array $metadata = [], string $status = 'success')
    {
        return UserActions::create([
            'user_id' => $user->id,
            'action' => $action,
            'description' => $description ?? $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'status' => $status,
            'metadata' => $metadata,
        ]);
    }
}