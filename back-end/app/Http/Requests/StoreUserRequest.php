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
            'name' => ['required', 'string', 'min:3', 'max:100'],

            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                Rule::unique('users', 'username')
            ],

            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],

            'password' => ['required', 'string', 'min:6'],

            'role' => ['sometimes', Rule::in(['admin', 'user'])],

            'confirmed' => ['sometimes', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'username.required' => 'Username is required',
            'email.required' => 'Email is required',
            'password.required' => 'Password is required',
        ];
    }
}
