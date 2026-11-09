
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/reset-password');
    };

    const EyeButton = ({ visible, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
            aria-label={visible ? 'Sembunyikan password' : 'Lihat password'}
        >
            {visible ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a14 14 0 0 1-3 3.8" />
                    <path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.3 0 2.5-.3 3.6-.7" />
                </svg>
            )}
        </button>
    );

    return (
        <>
            <Head title="Buat Password Baru - SSK.VOTE" />

            <div className="flex min-h-screen items-center justify-center bg-[#0b080a] px-4 py-10 text-white">
                <div className="w-full max-w-xl">
                    <div className="mb-8 text-center">
                        <p className="font-bold uppercase tracking-[0.3em] text-red-500">
                            SSK.VOTE
                        </p>

                        <h1 className="mt-4 text-3xl font-black md:text-4xl">
                            Buat Password Baru
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Masukkan password baru untuk akun kamu.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#151015] p-6 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block font-semibold"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    required
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-5 py-4 text-white outline-none focus:border-red-500"
                                />

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block font-semibold"
                                >
                                    Password Baru
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(event) =>
                                            setData('password', event.target.value)
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-5 py-4 pr-14 text-white outline-none focus:border-red-500"
                                    />

                                    <EyeButton
                                        visible={showPassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-2 block font-semibold"
                                >
                                    Konfirmasi Password Baru
                                </label>

                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmation ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(event) =>
                                            setData(
                                                'password_confirmation',
                                                event.target.value
                                            )
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi password baru"
                                        className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-5 py-4 pr-14 text-white outline-none focus:border-red-500"
                                    />

                                    <EyeButton
                                        visible={showConfirmation}
                                        onClick={() =>
                                            setShowConfirmation(!showConfirmation)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Password Baru'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
