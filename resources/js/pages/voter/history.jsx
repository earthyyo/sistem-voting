
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';

const formatNumber = (value) =>
    new Intl.NumberFormat('id-ID').format(Number(value) || 0);

const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function History({ periods = [] }) {
    return (
        <VoterLayout title="Riwayat Periode - SSK.VOTE">
            <Head title="Riwayat Periode" />

            <div className="min-h-screen bg-[#0b080a] px-4 py-8 text-white md:px-8">
                <div className="mx-auto max-w-6xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                        SSK.VOTE
                    </p>

                    <h1 className="mt-2 text-3xl font-black md:text-4xl">
                        Riwayat Periode
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Daftar seluruh periode voting yang telah selesai.
                    </p>

                    <div className="mt-8 space-y-4">
                        {periods.length > 0 ? (
                            periods.map((period) => (
                                <section
                                    key={period.id}
                                    className="rounded-2xl border border-white/10 bg-[#151015] p-5 transition hover:border-red-500/30"
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                                                Periode Voting
                                            </p>

                                            <h2 className="mt-2 text-xl font-black">
                                                {period.name}
                                            </h2>

                                            <p className="mt-2 text-sm text-gray-400">
                                                {formatDate(period.start_at)}
                                                {' - '}
                                                {formatDate(period.end_at)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-8 py-3 text-xs font-bold text-green-400">
                                                Selesai
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-white/10 pt-4">
                                        <Link
                                            href={`/ranking?period=${period.id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                                        >
                                            Lihat Ranking
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-[#151015] p-10 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
                                    ♥
                                </div>

                                <h2 className="mt-5 font-bold text-gray-300">
                                    Belum ada riwayat periode
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Periode voting yang telah selesai akan
                                    muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VoterLayout>
    );
}
