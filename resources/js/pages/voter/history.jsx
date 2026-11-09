
import React from 'react';
import { Head } from '@inertiajs/react';
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

export default function History({ history = [] }) {
    const historyData = Array.isArray(history) ? history : [];

    return (
        <VoterLayout title="Riwayat Vote - SSK.VOTE">
            <Head title="Riwayat Vote" />

            <div className="min-h-screen bg-[#0b080a] px-4 py-8 text-white md:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                            SSK.VOTE
                        </p>

                        <h1 className="mt-2 text-3xl font-black md:text-4xl">
                            Riwayat Vote
                        </h1>

                        <p className="mt-2 text-gray-400">
                            Catatan member yang pernah kamu pilih di setiap periode voting.
                        </p>
                    </div>

                    {/* History */}
                    <div className="mt-8 space-y-8">
                        {historyData.length > 0 ? (
                            historyData.map((period) => (
                                <section
                                    key={period.period_id}
                                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#151015]"
                                >
                                    {/* Period Header */}
                                    <div className="border-b border-white/10 bg-white/[0.03] p-5">
                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                                                    Periode Voting
                                                </p>

                                                <h2 className="mt-2 text-xl font-black">
                                                    {period.period_name}
                                                </h2>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {period.start_at
                                                        ? formatDate(period.start_at)
                                                        : '-'}
                                                    {' - '}
                                                    {period.end_at
                                                        ? formatDate(period.end_at)
                                                        : '-'}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                                <p className="text-xs text-gray-400">
                                                    Total suara digunakan
                                                </p>

                                                <p className="mt-1 text-xl font-black text-red-400">
                                                    {formatNumber(period.total_votes)}
                                                    <span className="ml-1 text-xs font-medium">
                                                        Vote
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member List */}
                                    <div className="divide-y divide-white/10">
                                        {period.members?.length > 0 ? (
                                            period.members.map((member) => (
                                                <div
                                                    key={member.member_id}
                                                    className="flex items-center gap-4 p-4 sm:p-5"
                                                >
                                                    {/* Member Photo */}
                                                    {member.member_photo ? (
                                                        <img
                                                            src={member.member_photo}
                                                            alt={member.member_name}
                                                            className="h-16 w-16 shrink-0 rounded-xl object-cover object-top"
                                                        />
                                                    ) : (
                                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-950 text-2xl font-bold text-red-400">
                                                            {member.member_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || '?'}
                                                        </div>
                                                    )}

                                                    {/* Member Information */}
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate font-bold text-white">
                                                            {member.member_name}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-400">
                                                            {member.member_team || 'Tanpa tim'}
                                                        </p>

                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Terakhir voting:{' '}
                                                            {formatDate(member.voted_at)}
                                                        </p>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="shrink-0 text-right">
                                                        <p className="text-xl font-black text-red-400">
                                                            {formatNumber(member.quantity)}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            Suara
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-sm text-gray-500">
                                                Belum ada vote pada periode ini.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-[#151015] p-10 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
                                    ♥
                                </div>

                                <h2 className="mt-5 font-bold text-gray-300">
                                    Belum ada riwayat vote
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Vote yang berhasil kamu lakukan akan muncul di sini.
                                </p>

                                <a
                                    href="/members"
                                    className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                                >
                                    Mulai Voting
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VoterLayout>
    );
}
