
import React, { useEffect, useState } from 'react';

function getTimeState(period) {
    if (!period?.start_at || !period?.end_at) {
        return {
            phase: 'unavailable',
            remaining: 0,
        };
    }

    const now = Date.now();
    const start = new Date(period.start_at).getTime();
    const end = new Date(period.end_at).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) {
        return {
            phase: 'unavailable',
            remaining: 0,
        };
    }

    if (period.status === 'closed' || now >= end) {
        return {
            phase: 'ended',
            remaining: 0,
        };
    }

    if (now < start) {
        return {
            phase: 'upcoming',
            remaining: Math.max(0, start - now),
        };
    }

    return {
        phase: 'active',
        remaining: Math.max(0, end - now),
    };
}

function formatNumber(value) {
    return String(value).padStart(2, '0');
}

export default function PeriodCountdown({
    period = null,
    compact = false,
}) {
    const [timeState, setTimeState] = useState(() =>
        getTimeState(period)
    );

    useEffect(() => {
        const updateTime = () => {
            setTimeState(getTimeState(period));
        };

        updateTime();

        const interval = window.setInterval(updateTime, 1000);

        return () => window.clearInterval(interval);
    }, [period?.id, period?.start_at, period?.end_at, period?.status]);

    if (!period) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-bold text-zinc-300">
                    Belum ada periode voting
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                    Informasi periode akan ditampilkan di sini.
                </p>
            </div>
        );
    }

    const { phase, remaining } = timeState;

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    const isActive = phase === 'active';
    const isUpcoming = phase === 'upcoming';

    const statusLabel = {
        active: 'SEDANG BERLANGSUNG',
        upcoming: 'AKAN DIMULAI',
        ended: 'PERIODE BERAKHIR',
        unavailable: 'WAKTU TIDAK VALID',
    }[phase];

    const description = {
        active: 'Waktu tersisa sampai voting berakhir',
        upcoming: 'Waktu menuju pembukaan voting',
        ended: 'Periode voting ini telah berakhir',
        unavailable: 'Periksa tanggal periode voting',
    }[phase];

    const units = [
        { label: 'Hari', value: days },
        { label: 'Jam', value: hours },
        { label: 'Menit', value: minutes },
        { label: 'Detik', value: seconds },
    ];

    return (
        <section
            className={`rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#291018] via-[#170d12] to-[#100b0e] ${
                compact ? 'p-4' : 'p-5 sm:p-6'
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
                        Periode Voting
                    </p>
                    <h3 className="mt-2 text-lg font-black text-white">
                        {period.name}
                    </h3>
                </div>

                <span
                    className={`rounded-full px-3 py-1.5 text-[9px] font-black tracking-wider ${
                        isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : isUpcoming
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-zinc-700/50 text-zinc-400'
                    }`}
                >
                    {statusLabel}
                </span>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
                {description}
            </p>

            {phase === 'unavailable' ? (
                <p className="mt-3 text-sm text-zinc-500">
                    Tanggal mulai atau selesai tidak tersedia.
                </p>
            ) : phase === 'ended' ? (
                <p className="mt-3 text-sm font-bold text-zinc-300">
                    Countdown selesai.
                </p>
            ) : (
                <div
                    className={`mt-4 grid grid-cols-4 ${
                        compact ? 'gap-2' : 'gap-3'
                    }`}
                >
                    {units.map((unit) => (
                        <div
                            key={unit.label}
                            className="rounded-xl border border-white/10 bg-black/30 px-1 py-3 text-center"
                        >
                            <p
                                className={`font-black tabular-nums text-white ${
                                    compact
                                        ? 'text-xl sm:text-2xl'
                                        : 'text-2xl sm:text-3xl'
                                }`}
                            >
                                {formatNumber(unit.value)}
                            </p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 sm:text-[10px]">
                                {unit.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 border-t border-white/10 pt-3 text-xs leading-6 text-zinc-500">
                <p>
                    Mulai:{' '}
                    {new Date(period.start_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </p>
                <p>
                    Selesai:{' '}
                    {new Date(period.end_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </p>
            </div>
        </section>
    );
}
