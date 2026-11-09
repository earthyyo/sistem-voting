import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Show({ voter }) {
    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <AdminLayout title="Detail Voter">
            <Head title="Detail Voter" />

            <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
                <header>
                    <Link
                        href="/admin/voters"
                        className="text-sm font-semibold text-red-400 hover:text-red-300"
                    >
                        ← Kembali ke Data Voter
                    </Link>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                        SSK.VOTE / ADMIN
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Detail Voter
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Informasi akun dan aktivitas voting voter.
                    </p>
                </header>

                {/* Profil */}
                <section className="rounded-2xl border border-white/10 bg-[#151014] p-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {voter.photo_url ? (
                            <img
                                src={voter.photo_url}
                                alt={voter.name}
                                className="h-24 w-24 rounded-full border-2 border-red-500/30 object-cover"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-950 text-3xl font-bold text-red-300">
                                {voter.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white">
                                {voter.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                {voter.email}
                            </p>

                            <span className="mt-3 inline-block rounded-full bg-green-950 px-3 py-1 text-xs font-semibold text-green-300">
                                Akun Voter
                            </span>
                        </div>
                    </div>
                </section>

                {/* Statistik */}
                <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Suara Digunakan
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {voter.total_votes.toLocaleString('id-ID')}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Akumulasi seluruh quantity voting
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Transaksi
                        </p>

                        <p className="mt-2 text-3xl font-bold text-white">
                            {voter.total_transactions.toLocaleString('id-ID')}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Jumlah transaksi voting
                        </p>
                    </div>
                </section>

                {/* Informasi akun */}
                <section className="rounded-2xl border border-white/10 bg-[#151014] p-6">
                    <h2 className="text-lg font-bold">
                        Informasi Akun
                    </h2>

                    <div className="mt-5 space-y-4">
                        <div className="flex flex-col justify-between gap-1 border-b border-white/10 pb-4 sm:flex-row">
                            <span className="text-sm text-gray-400">
                                Nama Lengkap
                            </span>

                            <span className="font-medium text-white">
                                {voter.name}
                            </span>
                        </div>

                        <div className="flex flex-col justify-between gap-1 border-b border-white/10 pb-4 sm:flex-row">
                            <span className="text-sm text-gray-400">
                                Email
                            </span>

                            <span className="font-medium text-white">
                                {voter.email}
                            </span>
                        </div>

                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                            <span className="text-sm text-gray-400">
                                Tanggal Registrasi
                            </span>

                            <span className="font-medium text-white">
                                {formatDate(voter.created_at)}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}