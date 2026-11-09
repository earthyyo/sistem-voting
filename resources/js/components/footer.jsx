
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#100c0f] text-gray-400">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Branding */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="text-xl font-black tracking-[0.2em] text-white"
                        >
                            <span className="text-red-500">SSK.</span>
                            <span>VOTE</span>
                        </Link>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Platform voting untuk mendukung member favoritmu.
                            Suaramu berarti untuk perjalanan mereka.
                        </p>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h3 className="mb-3 text-sm font-bold text-white">
                            Navigasi
                        </h3>

                        <div className="flex flex-col gap-2 text-sm">
                            <Link
                                href="/"
                                className="transition hover:text-red-400"
                            >
                                Halaman Utama
                            </Link>

                            <Link
                                href="/login"
                                className="transition hover:text-red-400"
                            >
                                Masuk
                            </Link>

                            <Link
                                href="/register"
                                className="transition hover:text-red-400"
                            >
                                Daftar
                            </Link>
                        </div>
                    </div>

                    {/* Informasi */}
                    <div>
                        <h3 className="mb-3 text-sm font-bold text-white">
                            Tentang
                        </h3>

                        <p className="max-w-xs text-sm leading-6">
                            SSK.VOTE merupakan proyek sistem informasi voting
                            untuk keperluan pembelajaran dan demonstrasi.
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-gray-500 sm:text-left">
                    © {new Date().getFullYear()} SSK.VOTE. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
