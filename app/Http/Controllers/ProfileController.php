<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

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
            'mustVerifyEmail' => false, // Nonaktifkan pengecekan email verifikasi
            'status' => session('status'),
        ]);
    }

    /**
     * Update data profil user.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        // Tidak perlu reset email_verified_at karena verifikasi email dimatikan

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Hapus akun user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
