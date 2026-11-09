
import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

function EyeIcon({ visible }) {
    return visible ? (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.6 3.5" />
            <path d="M6.2 6.2C3.9 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.1 0 2.1-.2 3-.6" />
        </svg>
    );
}

export default function Register() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        clearErrors();

        if (data.password.length < 8) {
            return;
        }

        if (data.password !== data.password_confirmation) {
            return;
        }

        // Kirim data ke AuthController Laravel.
        post('/register');
    };

    const passwordsMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    const passwordMismatch =
        data.password_confirmation.length > 0 &&
        data.password !== data.password_confirmation;

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b080a] px-5 py-12 text-white">
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-red-700/20 blur-[120px]" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-rose-500/10 blur-[120px]" />

            {/* Logo */}
            <Link
                href="/"
                className="absolute left-5 top-6 flex items-center gap-3 sm:left-10 sm:top-8"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black">
                    S
                </div>
                <span className="text-lg font-black tracking-tight">
                    SSK<span className="text-red-500">.</span>VOTE
                </span>
            </Link>

            <div className="relative w-full max-w-md">
                {/* Heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-3xl text-red-400">
                        ♥
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                        Join The Community
                    </p>

                    <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                        Create Account.
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                        Buat akun dan mulai perjalanan mendukung oshi kamu.
                    </p>
                </div>

                {/* Register Card */}
                <div className="rounded-3xl border border-white/10 bg-[#151014]/90 p-6 shadow-2xl shadow-black/30 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama */}
                        <div>
                            <label
                                htmlFor="register-name"
                                className="mb-2 block text-sm font-bold text-zinc-200"
                            >
                                Nama Lengkap
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Masukkan nama kamu"
                                autoComplete="name"
                                required
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                            />

                            {errors.name && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="register-email"
                                className="mb-2 block text-sm font-bold text-zinc-200"
                            >
                                Email
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="nama@email.com"
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="register-password"
                                className="mb-2 block text-sm font-bold text-zinc-200"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                    placeholder="Minimal 8 karakter"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Sembunyikan password'
                                            : 'Lihat password'
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-zinc-500 transition hover:text-red-400"
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label
                                htmlFor="register-password-confirmation"
                                className="mb-2 block text-sm font-bold text-zinc-200"
                            >
                                Konfirmasi Password
                            </label>

                            <div className="relative">
                                <input
                                    id="register-password-confirmation"
                                    type={
                                        showConfirmation ? 'text' : 'password'
                                    }
                                    value={data.password_confirmation}
                                    onChange={(event) =>
                                        setData(
                                            'password_confirmation',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    aria-invalid={passwordMismatch}
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmation(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmation
                                            ? 'Sembunyikan konfirmasi password'
                                            : 'Lihat konfirmasi password'
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-zinc-500 transition hover:text-red-400"
                                >
                                    <EyeIcon visible={showConfirmation} />
                                </button>
                            </div>

                            {data.password_confirmation.length > 0 && (
                                <p
                                    className={`mt-2 text-xs ${
                                        passwordsMatch
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }`}
                                >
                                    {passwordsMatch
                                        ? '✓ Password cocok'
                                        : 'Konfirmasi password belum cocok.'}
                                </p>
                            )}

                            {errors.password_confirmation && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-4 font-black transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Membuat Akun...' : 'Buat Akun'}
                            {!processing && (
                                <span aria-hidden="true">→</span>
                            )}
                        </button>
                    </form>

                    <div className="my-6 border-t border-white/10" />

                    <p className="text-center text-sm text-zinc-400">
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="font-bold text-red-400 transition hover:text-red-300"
                        >
                            Masuk sekarang
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-600">
                    SSK.VOTE · Fan voting demo platform
                </p>
            </div>
        </main>
    );
}
