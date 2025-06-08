<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdatePasswordRequest; // Pastikan ini di-import
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException; // Tetap diperlukan untuk destroy
use Illuminate\Support\Facades\Hash; // Diperlukan untuk updatePassword

class ProfileController extends Controller
{
    /**
     * Tampilkan form profil user.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'auth' => [
                'user' => $request->user()->only('id', 'name', 'email', 'email_verified_at'),
            ],
            'mustVerifyEmail' => false, // Nonaktifkan pengecekan email verifikasi jika ini yang Anda inginkan
            'status' => session('status'),
        ]);
    }

    /**
     * Update data profil user (nama dan email).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Isi user dengan data yang sudah divalidasi dari ProfileUpdateRequest
        $request->user()->fill($request->validated());

        // Jika email diubah, set email_verified_at menjadi null (jika verifikasi email diaktifkan)
        // Saya asumsikan Anda tidak ingin reset ini karena 'mustVerifyEmail' diset false di edit()
        // Namun, jika nanti Anda aktifkan verifikasi email, blok ini penting.
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update password user.
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        // Update password user dengan password baru yang sudah di-hash
        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return Redirect::route('profile.edit')->with('status', 'password-updated');
    }

    /**
     * Hapus akun user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Validasi password untuk penghapusan akun
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Logout user, hapus akun, dan reset sesi
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}