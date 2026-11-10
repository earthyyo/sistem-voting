
import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';

function formatVotes(votes) {
    return new Intl.NumberFormat('id-ID').format(votes ?? 0);
}

function formatDate(date) {
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

function Members({
    members = [],
    activePeriod = null,
    votesUsed = 0,
    votesRemaining = 0,
    isAuthenticated = false,
}) {
    const [search, setSearch] = useState('');
    const [generation, setGeneration] = useState('Semua Generasi');
    const [team, setTeam] = useState('Semua Team');
    const [submittingMember, setSubmittingMember] = useState(null);

    const { props } = usePage();
    const flash = props.flash ?? {};
    const errors = props.errors ?? {};

    const generations = useMemo(() => {
        const values = members
            .map((member) => member.generation)
            .filter(Boolean)
            .map((value) => String(value));

        return [
            'Semua Generasi',
            ...Array.from(new Set(values)).sort((a, b) =>
                a.localeCompare(b, 'id')
            ),
        ];
    }, [members]);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch = (member.name ?? '')
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesGeneration =
                generation === 'Semua Generasi' ||
                String(member.generation) === generation;

            const matchesTeam =
                team === 'Semua Team' || member.team === team;

            return matchesSearch && matchesGeneration && matchesTeam;
        });
    }, [members, search, generation, team]);

    function handleVote(member) {
        if (!activePeriod) {
            return;
        }

        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        if (votesRemaining <= 0) {
            window.alert('Kuota voting kamu sudah habis.');
            return;
        }

        const confirmed = window.confirm(
            `Kamu yakin ingin memberikan 1 suara kepada ${member.name}?\n\n` +
            `Sisa kuota saat ini: ${votesRemaining} suara.`
        );

        if (!confirmed) return;

        setSubmittingMember(member.id);

        router.post(
            '/votes',
            {
                member_id: member.id,
                voting_period_id: activePeriod.id,
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmittingMember(null),
            }
        );
    }

    const pageContent = (
        <div className="min-h-screen bg-[#0b080a] pb-24 text-white lg:pb-8">
            {/* HEADER */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b080a]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
                    <a
                        href="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black">
                            S
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-tight">
                                SSK<span className="text-red-500">.</span>VOTE
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                                Member Directory
                            </p>
                        </div>
                    </a>

                    <a
                        href={isAuthenticated ? '/dashboard' : '/login'}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/50 hover:text-white"
                    >
                        {isAuthenticated ? 'Dashboard →' : 'Login →'}
                    </a>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

                {/* JUDUL HALAMAN */}
                <section className="mb-10">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                        Find Your Oshi
                    </p>

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                                Daftar <span className="text-red-500">Member</span>
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                                Kenali para member dan temukan oshi favoritmu.
                                Lihat profil member kapan saja, meskipun periode
                                voting belum dibuka.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#151014] px-5 py-4">
                            <p className="text-xs text-zinc-500">
                                Total member
                            </p>

                            <p className="mt-1 text-2xl font-black">
                                {filteredMembers.length}
                                <span className="ml-2 text-sm font-medium text-zinc-500">
                                    member
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* FLASH MESSAGE */}
                {flash.success && (
                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {flash.error}
                    </div>
                )}

                {errors.member_id && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {errors.member_id}
                    </div>
                )}

                {errors.voting_period_id && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {errors.voting_period_id}
                    </div>
                )}

                {/* INFORMASI PERIODE VOTING */}
                <section className="mb-8 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/40 to-[#151014] p-5 sm:p-6">
                    {activePeriod ? (
                        <>
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                        Periode Voting Aktif
                                    </p>

                                    <h2 className="mt-2 text-xl font-black sm:text-2xl">
                                        {activePeriod.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-zinc-400">
                                        Berakhir: {formatDate(activePeriod.end_at)}
                                    </p>
                                </div>

                                {isAuthenticated ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                            <p className="text-xs text-zinc-400">
                                                Suara terpakai
                                            </p>

                                            <p className="mt-1 text-2xl font-black">
                                                {votesUsed}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                            <p className="text-xs text-red-300">
                                                Sisa kuota
                                            </p>

                                            <p className="mt-1 text-2xl font-black text-red-400">
                                                {votesRemaining}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href="/login"
                                        className="rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-red-500"
                                    >
                                        Login untuk Voting
                                    </a>
                                )}
                            </div>

                            {isAuthenticated && votesRemaining === 0 && (
                                <p className="mt-4 text-sm text-amber-300">
                                    Kuota kamu sudah habis untuk periode ini.
                                </p>
                            )}
                        </>
                    ) : (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                Voting Belum Tersedia
                            </p>

                            <h2 className="mt-2 text-xl font-black">
                                Belum ada periode voting aktif
                            </h2>

                            <p className="mt-2 text-sm text-zinc-400">
                                Kamu tetap bisa melihat seluruh daftar member.
                                Voting akan tersedia kembali ketika periode dibuka oleh admin.
                            </p>
                        </div>
                    )}
                </section>

                {/* FILTER MEMBER */}
                <section className="mb-8 rounded-2xl border border-white/10 bg-[#151014] p-4 sm:p-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="member-search"
                                className="mb-2 block text-sm font-semibold text-zinc-300"
                            >
                                Cari member
                            </label>

                            <input
                                id="member-search"
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama member..."
                                className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="generation-filter"
                                className="mb-2 block text-sm font-semibold text-zinc-300"
                            >
                                Filter generasi
                            </label>

                            <select
                                id="generation-filter"
                                value={generation}
                                onChange={(event) => setGeneration(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                            >
                                {generations.map((item) => (
                                    <option key={item} value={item}>
                                        {item === 'Semua Generasi'
                                            ? item
                                            : `Generasi ${item.replace(/^Generasi\s*/i, '')}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="mb-3 text-sm font-semibold text-zinc-300">
                            Filter Team
                        </p>

                        <div
                            className="flex flex-wrap gap-2"
                            role="group"
                            aria-label="Filter berdasarkan team"
                        >
                            {['Semua Team', 'Love', 'Dream', 'Passion'].map((item) => {
                                const isActive = team === item;

                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setTeam(item)}
                                        aria-pressed={isActive}
                                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                            isActive
                                                ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/40'
                                                : 'border-white/10 bg-[#0b080a] text-zinc-400 hover:border-red-500/50 hover:text-white'
                                        }`}
                                    >
                                        {item === 'Semua Team' ? item : `Team ${item}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* DAFTAR MEMBER */}
                {filteredMembers.length > 0 ? (
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMembers.map((member) => (
                            <article
                                key={member.id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151014] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
                            >
                                {/* FOTO MEMBER */}
                                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 to-red-950">
                                    <div className="absolute inset-0 bg-black/20" />

                                    <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/15" />

                                    <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-white/15" />

                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="relative h-full w-full object-cover object-top"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-black/20 text-3xl font-black shadow-2xl">
                                            {(member.name ?? '')
                                                .split(' ')
                                                .map((word) => word[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                        {/^[\s]*generasi/i.test(String(member.generation))
                                            ? member.generation
                                            : `Generasi ${member.generation ?? '-'}`}
                                    </span>

                                    {member.team && (
                                        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                            {member.team}
                                        </span>
                                    )}
                                </div>

                                {/* INFORMASI MEMBER */}
                                <div className="p-5">
                                    <h2 className="text-xl font-bold transition group-hover:text-red-400">
                                        {member.name}
                                    </h2>

                                    <p className="mt-1 min-h-10 text-sm leading-5 text-zinc-500">
                                        {member.description || 'Member SSK.VOTE'}
                                    </p>

                                    <div className="my-5 flex items-center justify-between border-y border-white/10 py-4">
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Total vote periode ini
                                            </p>

                                            <p className="mt-1 text-lg font-bold">
                                                {formatVotes(member.total_votes)}
                                            </p>
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* TOMBOL VOTING */}
                                    <button
                                        type="button"
                                        onClick={() => handleVote(member)}
                                        disabled={
                                            submittingMember !== null ||
                                            !activePeriod ||
                                            (isAuthenticated && votesRemaining <= 0)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submittingMember === member.id
                                            ? 'Mengirim vote...'
                                            : !activePeriod
                                                ? 'Voting Ditutup'
                                                : !isAuthenticated
                                                    ? 'Login untuk Vote'
                                                    : votesRemaining <= 0
                                                        ? 'Kuota Habis'
                                                        : 'Vote Member →'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
                        <h2 className="text-lg font-bold">
                            {members.length === 0
                                ? 'Belum ada member'
                                : 'Member tidak ditemukan'}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            {members.length === 0
                                ? 'Belum ada member aktif yang tersedia.'
                                : 'Coba gunakan nama atau filter generasi/team yang lain.'}
                        </p>

                        {members.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setGeneration('Semua Generasi');
                                    setTeam('Semua Team');
                                }}
                                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold transition hover:bg-red-500"
                            >
                                Reset Filter
                            </button>
                        )}
                    </section>
                )}
            </main>
        </div>
    );

    // Layout voter hanya digunakan jika user sudah login.
    if (isAuthenticated) {
        return (
            <VoterLayout title="Daftar Member">
                {pageContent}
            </VoterLayout>
        );
    }

    // Pengunjung umum tetap dapat melihat daftar member.
    return pageContent;
}

export default Members;
