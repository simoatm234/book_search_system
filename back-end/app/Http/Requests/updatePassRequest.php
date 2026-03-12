<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePassRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'current_password' => [
                'required',
                'string',
                'min:6',
            ],
            'new_password' => [
                'required',
                'string',
                'min:6',
                'confirmed', // Expects new_password_confirmation field
                'different:current_password', // Must be different from current password
            ],
            'new_password_confirmation' => [
                'required',
                'string',
            ],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'current_password.required' => 'Current password is required',
            'current_password.string' => 'Current password must be a string',
            'current_password.min' => 'Current password must be at least 6 characters',
            'new_password.required' => 'New password is required',
            'new_password.string' => 'New password must be a string',
            'new_password.min' => 'New password must be at least 6 characters',
            'new_password.confirmed' => 'Passwords do not match',
            'new_password.different' => 'New password must be different from current password',
            'new_password_confirmation.required' => 'Password confirmation is required',
            'new_password_confirmation.string' => 'Password confirmation must be a string',
        ];
    }
}
