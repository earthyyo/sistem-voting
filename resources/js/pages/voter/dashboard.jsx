
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';
import PeriodCountdown from '../../components/PeriodCountdown';

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    const paths = {
        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </>
        ),
        logout: (
            <>
                <path d="M10 17l5-5-5-5M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </>
        ),
        menu: <path d="M4 6h16M4 12h16M4 18h16" />,
        chevron: <path d="m7 10 5 5 5-5" />,
        heart: (
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        ),
        history: (
            <>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5M12 7v5l3 2" />
            </>
        ),
        trophy: (
            <>
                <path d="M8 21h8M12 17v4" />
                <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
            </>
        ),
    };

    return <svg {...common}>{paths[name] || null}</svg>;
}

// Avatar dengan foto profil dari database
function Avatar({ initials, photoUrl, size = 'normal' }) {
    const sizeClass =
        size === 'large'
            ? 'h-16 w-16 text-xl'
            : size === 'small'
              ? 'h-9 w-9 text-xs'
              : 'h-11 w-11 text-sm';

    return (
        <div
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-red-400/30 bg-gradient-to-br from-red-500 to-[#4a1022] font-black text-white ${sizeClass}`}
        >
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt="Foto profil voter"
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </div>
    );
}

function StatCard({ label, value, description, icon }) {
    return (
        <article className="rounded-2xl border border-white/10 bg-[#151014] p-5 transition hover:border-red-500/30">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-zinc-400">{label}</p>

                
            </div>

            <h3 className="mt-5 text-3xl font-black tracking-tight">
                {value}
            </h3>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
                {description}
            </p>
        </article>
    );
}

export default function Dashboard({
    activePeriod = null,
    authUser = null,
    stats = null,
    previousPeriod = null,
    previousRanking = [],
}) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const userName = authUser?.name || 'Voter';
    const userEmail = authUser?.email || '';
    const photoUrl = authUser?.photo_url || null;

    const voter = {
        name: userName,
        email: userEmail,
        initials: userName
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
    };

    // Statistik voting dari backend
    const totalVotes = Number(stats?.totalVotes ?? 0);
    const remainingQuota = stats?.remainingQuota ?? 0;
    const targetSenbatsu = stats?.targetSenbatsu ?? 12;

    // Ranking periode sebelumnya dari database
    const rankingData = Array.isArray(previousRanking)
        ? previousRanking
        : [];

    const formatNumber = (value) =>
        new Intl.NumberFormat('id-ID').format(Number(value) || 0);

    const handleLogout = () => {
        if (loggingOut) return;

        setLoggingOut(true);

        router.post(
            '/logout',
            {},
            {
                onFinish: () => {
                    setLoggingOut(false);
                },
            }
        );
    };

    return (
        <VoterLayout
            title="Dashboard"
            header={({ sidebarOpen, toggleSidebar }) => (
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b080a]/95 backdrop-blur-xl">
                    <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                aria-label={
                                    sidebarOpen
                                        ? 'Tutup sidebar'
                                        : 'Buka sidebar'
                                }
                                aria-expanded={sidebarOpen}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-red-500/40 hover:bg-red-600 hover:text-white"
                            >
                                {sidebarOpen ? '×' : <Icon name="menu" />}
                            </button>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold">
                                    Dashboard
                                </p>

                                <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
                                    Ringkasan akun dan aktivitas voting kamu
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold">
                                    {voter.name}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Voter
                                </p>
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setProfileMenuOpen((previous) => !previous)
                                    }
                                    aria-expanded={profileMenuOpen}
                                    aria-label="Buka menu profil"
                                    className="flex items-center gap-2 rounded-xl border border-white/10 p-1.5 pr-2 transition hover:border-red-500/40 sm:pr-3"
                                >
                                    <Avatar
                                        initials={voter.initials}
                                        photoUrl={photoUrl}
                                        size="small"
                                    />

                                    <span className="hidden text-zinc-400 sm:block">
                                        <Icon name="chevron" size={16} />
                                    </span>
                                </button>

                                {profileMenuOpen && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Tutup menu profil"
                                            className="fixed inset-0 z-30 cursor-default"
                                            onClick={() =>
                                                setProfileMenuOpen(false)
                                            }
                                        />

                                        <div className="absolute right-0 top-14 z-40 w-64 rounded-2xl border border-white/10 bg-[#181116] p-3 shadow-2xl shadow-black/50">
                                            <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-4 pt-2">
                                                <Avatar
                                                    initials={voter.initials}
                                                    photoUrl={photoUrl}
                                                />

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold">
                                                        {voter.name}
                                                    </p>

                                                    <p className="truncate text-xs text-zinc-500">
                                                        {voter.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <a
                                                href="/profile"
                                                onClick={() =>
                                                    setProfileMenuOpen(false)
                                                }
                                                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                            >
                                                <Icon name="user" size={18} />
                                                Profil Saya
                                            </a>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                disabled={loggingOut}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
                                            >
                                                <Icon name="logout" size={18} />
                                                {loggingOut
                                                    ? 'Memproses...'
                                                    : 'Keluar'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
            )}
        >
            <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 pb-8 sm:px-7 sm:py-8 lg:px-9">

                {/* Welcome banner */}
                <section className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#42101f] via-[#251019] to-[#151014] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-red-500/20 blur-[100px]" />
                    <div className="pointer-events-none absolute bottom-0 right-20 h-24 w-48 rounded-full bg-rose-500/10 blur-[70px]" />

                    <div className="relative max-w-2xl">
                        <h1 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                            Welcome back,
                            <br className="sm:hidden" />{' '}
                            <span className="text-red-400">
                                {voter.name}!
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                            Siap mendukung member favoritmu? Gunakan kuota
                            votingmu dan ikuti perjalanan menuju Senbatsu
                            Sousenkyo.
                        </p>

                        <a
                            href="/members"
                            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-red-500"
                        >
                            Vote Sekarang <span></span>
                        </a>
                    </div>
                </section>

                {/* Profil voter */}
                <section className="rounded-2xl border border-white/10 bg-[#151014] p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Avatar
                            initials={voter.initials}
                            photoUrl={photoUrl}
                            size="large"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
                                Profil Voter
                            </p>

                            <h2 className="mt-2 text-xl font-black">
                                {voter.name}
                            </h2>

                            <p className="mt-1 break-all text-sm text-zinc-400">
                                {voter.email}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                                    Akun Terdaftar
                                </span>

                                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold text-zinc-400">
                                    Voter
                                </span>
                            </div>
                        </div>

                        <a
                            href="/profile"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold transition hover:border-red-500/40 hover:bg-red-500/5"
                        >
                            <Icon name="user" size={17} />
                            Edit Profil
                        </a>
                    </div>
                </section>

                {/* Statistik voting */}
                <section>
                    <div className="mb-5">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                            Your Overview
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                            Ringkasan Voting
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            icon="heart"
                            label="Sisa Kuota"
                            value={`${formatNumber(remainingQuota)} Vote`}
                            description="Sisa kuota voting akun kamu"
                        />

                        <StatCard
                            icon="history"
                            label="Total Vote Kamu"
                            value={`${formatNumber(totalVotes)} Vote`}
                            description="Jumlah vote yang sudah digunakan"
                        />

                        <StatCard
                            icon="trophy"
                            label="Target Senbatsu"
                            value={`Top ${formatNumber(targetSenbatsu)}`}
                            description="Dukung member pilihanmu"
                        />
                    </div>
                </section>

                {/* Periode voting */}
                <PeriodCountdown
                    period={activePeriod}
                    compact
                />

                {/* Ranking periode sebelumnya */}
                {previousPeriod && rankingData.length > 0 && (
                    <section>
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                                    Community Favorites
                                </p>

                                <h2 className="mt-2 text-2xl font-black">
                                    Ranking {previousPeriod.name}
                                </h2>
                            </div>

                            <a
                                href="/ranking"
                                className="shrink-0 text-xs font-bold text-red-400 transition hover:text-red-300"
                            >
                                Lihat Semua →
                            </a>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                            {rankingData.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-4 border-b border-white/10 p-4 last:border-b-0 sm:p-5"
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                            index === 0
                                                ? 'bg-yellow-400 text-black'
                                                : index === 1
                                                  ? 'bg-zinc-300 text-black'
                                                  : 'bg-orange-800/60 text-orange-200'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>

                                    <div className="flex min-w-0 flex-1 items-center gap-3">
    {member.photo_url ? (
        <img
            src={member.photo_url}
            alt={member.name}
            className="h-11 w-11 shrink-0 rounded-xl object-cover object-top"
            loading="lazy"
        />
    ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-[#4a1022] text-sm font-black text-white">
            {member.name?.charAt(0) || '?'}
        </div>
    )}

    <div className="min-w-0">
        <p className="truncate text-sm font-bold">
            {member.name}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
            {member.team || 'Member'}
        </p>
    </div>
</div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-red-300">
                                            {formatNumber(member.total_votes)}
                                        </p>

                                        <p className="mt-1 text-[10px] text-zinc-600">
                                            votes
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </VoterLayout>
    );
}
