<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Redirect user berdasarkan role.
     */
    private function redirectByRole(): RedirectResponse
    {
        $user = Auth::user();

        if ($user?->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user?->role === 'voter') {
            return redirect()->route('dashboard');
        }

        Auth::logout();

        return redirect()->route('login');
    }

    /**
     * Menampilkan halaman login.
     */
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }

        return Inertia::render('login');
    }

    /**
     * Menampilkan halaman registrasi.
     */
    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }

        return Inertia::render('register');
    }

    /**
     * Memproses registrasi voter.
     */
    public function register(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.unique' => 'Email sudah terdaftar. Silakan login dengan akun kamu.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'voter',
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()
            ->route('dashboard')
            ->with('success', 'Akun berhasil dibuat. Selamat datang!');
    }

    /**
     * Memproses login admin dan voter.
     */
    public function login(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        $request->session()->regenerate();

        return $this->redirectByRole();
    }

    /**
     * Memproses logout.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()
            ->route('home')
            ->with('success', 'Kamu berhasil logout.');
    }
}