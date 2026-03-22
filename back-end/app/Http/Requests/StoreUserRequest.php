<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100'
            ],

            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-Z0-9_]+$/',
                // Only check unique among non-deleted users
                Rule::unique('users', 'username')->whereNull('deleted_at')
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->whereNull('deleted_at')
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'
            ],

            'password_confirmation' => [
                'required',
                'string'
            ],

            'role' => [
                'sometimes',
                Rule::in(['admin', 'user', 'librarian'])
            ],

            'confirmed' => [
                'sometimes',
                'boolean'
            ]
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required',
            'name.min' => 'Name must be at least 2 characters',
            'name.max' => 'Name must not exceed 100 characters',

            'username.required' => 'Username is required',
            'username.min' => 'Username must be at least 3 characters',
            'username.max' => 'Username must not exceed 50 characters',
            'username.regex' => 'Username can only contain letters, numbers, and underscores',
            'username.unique' => 'This username is already in use',

            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email address is already registered',

            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Passwords do not match',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number',

            'password_confirmation.required' => 'Please confirm your password',

            'role.in' => 'Invalid role selected',
        ];
    }
}
