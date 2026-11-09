
import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ForgotPassword() {
    const { props } = usePage();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Lupa Password - SSK.VOTE" />

            <div className="flex min-h-screen items-center justify-center bg-[#0b080a] px-4 py-10 text-white">
                <div className="w-full max-w-xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-3xl text-red-400">
                            ♥
                        </div>

                        <p className="font-bold uppercase tracking-[0.3em] text-red-500">
                            SSK.VOTE
                        </p>

                        <h1 className="mt-4 text-3xl font-black md:text-4xl">
                            Lupa Password?
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Masukkan email akun kamu untuk mendapatkan link
                            reset password.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#151015] p-6 sm:p-10">
                        {props.flash?.success && (
                            <p className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                                {props.flash.success}
                            </p>
                        )}

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
                                    placeholder="Masukkan email akun kamu"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-5 py-4 text-white outline-none transition focus:border-red-500"
                                />

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Mengirim...'
                                    : 'Kirim Link Reset Password'}
                            </button>
                        </form>

                        <div className="mt-6 border-t border-white/10 pt-6 text-center">
                            <a
                                href="/login"
                                className="text-sm font-semibold text-red-400 hover:text-red-300"
                            >
                                Kembali ke Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
