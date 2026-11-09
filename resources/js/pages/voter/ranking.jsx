
import React from 'react';
import { Head } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';

export default function Ranking({ activePeriod = null, ranking = [] }) {
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
                        Peringkat member berdasarkan jumlah vote.
                    </p>

                    <div className="mt-8 rounded-2xl border border-white/10 bg-[#151015] p-5">
                        <p className="text-sm text-gray-400">Periode Voting</p>
                        <h2 className="mt-1 text-xl font-bold">
                            {activePeriod?.name ?? 'Belum ada periode aktif'}
                        </h2>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151015]">
                        {ranking.length > 0 ? (
                            <div className="divide-y divide-white/10">
                                {ranking.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 p-4 transition hover:bg-white/[0.03] md:p-5"
                                    >
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black ${
                                            member.rank <= 3
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white/10 text-gray-300'
                                        }`}>
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
                                                {Number(member.total_votes ?? 0).toLocaleString('id-ID')}
                                            </p>
                                            <p className="text-xs text-gray-500">vote</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <p className="font-semibold text-gray-300">
                                    Belum ada data ranking
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Periode voting belum aktif atau belum ada member yang tersedia.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VoterLayout>
    );
}
