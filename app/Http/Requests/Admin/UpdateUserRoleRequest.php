<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize()
    {
        // Hanya admin boleh (optional, kalau route sudah middleware admin juga bisa true)
        return true;
    }

    public function rules()
    {
        return [
            'role' => 'required|string|exists:roles,name',
        ];
    }
}
