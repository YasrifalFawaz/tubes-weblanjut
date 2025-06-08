<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Mengizinkan permintaan jika pengguna sudah terautentikasi
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            // Aturan untuk password saat ini
            'current_password' => [
                'required', // Harus diisi
                'string',   // Harus berupa string
                // Custom rule untuk memeriksa apakah password yang dimasukkan cocok dengan password di database
                function ($attribute, $value, $fail) {
                    if (! Hash::check($value, $this->user()->password)) {
                        $fail(__('Kata sandi saat ini tidak cocok.'));
                    }
                }
            ],
            // Aturan untuk password baru
            'password' => [
                'required', // Harus diisi
                'confirmed', // Harus ada field 'password_confirmation' yang cocok
                Password::defaults(), // Aturan password default Laravel (min 8 karakter, huruf, angka, simbol)
            ],
        ];
    }
}