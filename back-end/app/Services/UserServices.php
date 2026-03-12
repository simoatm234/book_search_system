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
        return User::all();
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