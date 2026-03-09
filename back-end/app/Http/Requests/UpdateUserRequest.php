<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => ['sometimes', 'string', 'min:3', 'max:100'],

            'username' => [
                'sometimes',
                'string',
                'min:3',
                'max:50',
                Rule::unique('users', 'username')->ignore($userId)
            ],

            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($userId)
            ],

            'password' => ['sometimes', 'string', 'min:6'],

            'role' => [
                'sometimes',
                Rule::in(['admin', 'user'])
            ],
        ];
    }
    public function messages(): array
    {
        return [

            'name.string' => 'The name must be a valid text.',
            'name.min' => 'The name must be at least 3 characters.',
            'name.max' => 'The name cannot exceed 100 characters.',

            'username.string' => 'Username must be text.',
            'username.min' => 'Username must be at least 3 characters.',
            'username.max' => 'Username cannot exceed 50 characters.',
            'username.unique' => 'This username is already taken.',

            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',

            'password.min' => 'Password must be at least 6 characters.',

            'role.in' => 'Role must be either admin or user.',

            'confirmed.boolean' => 'Confirmed field must be true or false.'
        ];
    }
}
