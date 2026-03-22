<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserServices
{
    private function hashPassword(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $data;
    }
    public function AllUsers()
    {
        return User::withoutTrashed()->with([
            'userBooks' => function ($query) {
                $query->with('book')->orderBy('action_at', 'desc');
            }
        ])->get();
    }
    public function AllUsersTrashed()
    {
        return User::onlyTrashed()->get();
    }

    public function findUser($id)
    {
        return  User::withTrashed()->with([
            'userBooks' => function ($query) {
                $query->with('book')->orderBy('action_at', 'desc');
            }
        ])->findOrFail($id);
    }

    public function findUserTrashed($id)
    {
        return  User::onlyTrashed()->find($id);
    }

    
    public function storeUser(array $data)
    {
        $data = $this->hashPassword($data);
        return User::create($data);
    }
    public function update(User $user, array $data)
    {
        $data = $this->hashPassword($data);
        $user->update($data);
        return $user;
    }
    public function deleteUser(User $user)
    {
        return $user->delete();
    }
}