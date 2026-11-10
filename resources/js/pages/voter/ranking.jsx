
import React from 'react';
import { Head, router } from '@inertiajs/react';
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

export default function Ranking({
    announcedPeriods = [],
    selectedPeriod = null,
    ranking = [],
}) {
    const handlePeriodChange = (event) => {
        const periodId = event.target.value;

        router.get(
            '/ranking',
            periodId ? { period: periodId } : {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <VoterLayout title="Ranking Member - SSK.VOTE">
            <Head title="Ranking Member" />

            <div className="min-h-screen bg-[#0b080a] px-4 py-8 text-white md:px-8">
                <div className="mx-auto max-w-6xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                        SSK.VOTE
                    </p>

                    <h1 className="mt-2 text-3xl font-black md:text-4xl">
                        Ranking Member
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Peringkat 12 member teratas berdasarkan jumlah suara
                        pada setiap periode yang telah selesai.
                    </p>

                    {/* Filter Periode */}
                    <div className="mt-8 rounded-2xl border border-white/10 bg-[#151015] p-5">
                        <label
                            htmlFor="period"
                            className="text-sm font-semibold text-gray-400"
                        >
                            Pilih Periode Voting
                        </label>

                        {announcedPeriods.length > 0 ? (
                            <>
                                <select
                                    id="period"
                                    value={selectedPeriod?.id ?? ''}
                                    onChange={handlePeriodChange}
                                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 text-white outline-none focus:border-red-500"
                                >
                                    {announcedPeriods.map((period) => (
                                        <option
                                            key={period.id}
                                            value={period.id}
                                            className="bg-[#151015]"
                                        >
                                            {period.name}
                                        </option>
                                    ))}
                                </select>

                                {selectedPeriod && (
                                    <div className="mt-4">
                                        <h2 className="text-lg font-bold">
                                            {selectedPeriod.name}
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {formatDate(selectedPeriod.start_at)}
                                            {' - '}
                                            {formatDate(selectedPeriod.end_at)}
                                        </p>

                                        <span className="mt-3 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                                            Periode Selesai
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">
                                Belum ada periode voting yang selesai.
                            </p>
                        )}
                    </div>

                    {/* Ranking */}
                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151015]">
                        {selectedPeriod && ranking.length > 0 ? (
                            <div className="divide-y divide-white/10">
                                {ranking.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 p-4 transition hover:bg-white/[0.03] md:p-5"
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black ${
                                                member.rank <= 3
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-white/10 text-gray-300'
                                            }`}
                                        >
                                            #{member.rank}
                                        </div>

                                        {member.photo_url ? (
                                            <img
                                                src={member.photo_url}
                                                alt={member.name}
                                                className="h-14 w-14 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-950 text-xl font-bold text-red-400">
                                                {member.name?.charAt(0) ?? '?'}
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-bold">
                                                {member.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-400">
                                                {member.team || 'Tanpa tim'}
                                                {member.generation
                                                    ? ` • Generasi ${member.generation}`
                                                    : ''}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-black text-red-500">
                                                {formatNumber(member.total_votes)}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Vote
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : selectedPeriod ? (
                            <div className="p-10 text-center">
                                <p className="font-semibold text-gray-300">
                                    Belum ada suara pada periode ini.
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Ranking akan menampilkan member setelah
                                    terdapat suara yang masuk.
                                </p>
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <p className="font-semibold text-gray-300">
                                    Belum ada data ranking.
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Ranking akan tersedia otomatis setelah
                                    periode voting selesai.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VoterLayout>
    );
}
