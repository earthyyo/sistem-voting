
import React from 'react';
import PeriodCountdown from '../components/PeriodCountdown';

const teams = ['Love', 'Dream', 'Passion'];

const ArrowIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-400">
                {eyebrow}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                {title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                {description}
            </p>
        </div>
    );
}

function MemberPhoto({ member, className = '' }) {
    const [imageError, setImageError] = React.useState(false);

    const initials = (member?.name ?? '')
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#4a1524] via-[#23111a] to-[#100b0e] ${className}`}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(239,68,68,0.22),transparent_60%)]" />

            {member?.photo_url && !imageError ? (
                <img
                    src={member.photo_url}
                    alt={member.name}
                    className="relative h-full w-full object-cover object-top"
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 text-4xl font-black text-white/80">
                    {initials || '✦'}
                </div>
            )}
        </div>
    );
}

export default function Home({
    featuredMembers = [],
    activePeriod = null,
    isAuthenticated = false,
    finalSenbatsuPeriod = null,
    finalSenbatsu = [],
}) {
    const teamMembers = teams.map((team) => ({
        team,
        member:
            featuredMembers.find(
                (item) =>
                    String(item.team ?? '').toLowerCase() ===
                    team.toLowerCase()
            ) ?? null,
    }));

    // Hanya menampilkan maksimal 12 hasil final.
    const ranking = [...finalSenbatsu]
              .sort((a, b) => Number(a.rank) - Number(b.rank))
              .slice(0, 12);

    return (
        <main className="min-h-screen overflow-hidden bg-[#0b080a] text-white">
            {/* NAVBAR */}
            <header className="relative z-10 border-b border-white/10 bg-black/30">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
                    <a href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-black shadow-lg shadow-red-950">
                            S
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-tight">
                                SSK<span className="text-red-500">.</span>VOTE
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                                Fan Voting Platform
                            </p>
                        </div>
                    </a>

                    <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
                        <a href="#tentang" className="transition hover:text-white">
                            Tentang
                        </a>
                        <a href="#member" className="transition hover:text-white">
                            Member
                        </a>
                        <a href="#ranking" className="transition hover:text-white">
                            Ranking
                        </a>
                        <a href="#berita" className="transition hover:text-white">
                            Berita
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/login"
                            className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:text-white sm:inline-flex"
                        >
                            Masuk
                        </a>
                        <a
                            href="/register"
                            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold transition hover:bg-red-500"
                        >
                            Daftar
                        </a>
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section id="home" className="relative">
                <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-red-700/20 blur-[130px]" />
                <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-rose-500/10 blur-[130px]" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300 sm:text-xs">
                                SSK Voting 2026
                            </span>
                        </div>

                        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            Your Oshi,
                            <br />
                            Your <span className="text-red-500">Voice.</span>
                        </h1>

                        <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 md:text-lg md:leading-8">
                            Setiap vote punya arti. Dukung member favoritmu,
                            kumpulkan suara, dan jadilah bagian dari perjalanan
                            menuju Senbatsu Sousenkyo.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/login"
                                className="inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 font-black shadow-xl shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-red-500"
                            >
                                Vote Sekarang <ArrowIcon />
                            </a>

                            <a
                                href="#ranking"
                                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-4 font-bold text-zinc-200 transition hover:bg-white/[0.08]"
                            >
                                Lihat Ranking
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7">
                            <div>
                                <p className="text-2xl font-black">01</p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Suara untuk oshi
                                </p>
                            </div>

                            <div className="h-10 w-px bg-white/10" />

                            <div>
                                <p className="text-2xl font-black">12</p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Target Senbatsu
                                </p>
                            </div>

                            <div className="h-10 w-px bg-white/10" />

                            <div>
                                <p className="text-2xl font-black text-red-400">
                                    100%
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Semangat fans
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="tentang" className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3 md:px-10">
                    {[
                        {
                            number: '01',
                            title: 'Pilih Oshi',
                            description:
                                'Temukan member favoritmu dan kenali perjalanan mereka.',
                        },
                        {
                            number: '02',
                            title: 'Berikan Vote',
                            description:
                                'Gunakan kuota voting yang tersedia untuk mendukung pilihanmu.',
                        },
                        {
                            number: '03',
                            title: 'Pantau Ranking',
                            description:
                                'Ikuti hasil Senbatsu setelah periode voting berakhir.',
                        },
                    ].map((item) => (
                        <div key={item.number} className="group">
                            <p className="text-sm font-black tracking-widest text-red-500">
                                 {item.number}
                            </p>
                            <h3 className="mt-4 text-xl font-black transition group-hover:text-red-400">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MEMBER PREVIEW: ONE MEMBER PER TEAM */}
            <section id="member" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
                <SectionTitle
                    eyebrow="Find Your Oshi"
                    title="Who Has Your Heart?"
                    description="Kenali satu member dari setiap team dan tentukan siapa yang ingin kamu dukung di periode voting ini."
                />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {teamMembers.map(({ team, member }, index) => (
                        <article
                            key={team}
                            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151014] transition hover:-translate-y-1 hover:border-red-500/40"
                        >
                            <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-[#4a1524] via-[#23111a] to-[#100b0e]">
                                {member ? (
                                    <MemberPhoto
                                        member={member}
                                        className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(239,68,68,0.22),transparent_60%)]" />
                                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 text-4xl font-black text-white/80">
                                            {team.slice(0, 1)}
                                        </div>
                                    </>
                                )}

                                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                                    Team {team}
                                </span>

                                <span className="absolute right-4 top-4 text-xl text-yellow-400">
                                    {index === 0 ? '♛' : '✦'}
                                </span>
                            </div>

                            <div className="p-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                                    {member?.generation
                                        ? `${member.generation} Generation`
                                        : `Team ${team}`}
                                </p>

                                <h3 className="mt-2 text-lg font-black">
                                    {member?.name ?? `Belum ada member ${team}`}
                                </h3>

                                {/* Total vote sengaja tidak ditampilkan selama voting */}
                                <div className="mt-5 flex justify-center border-t border-white/10 pt-4">
    <a
        href="/login"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-xs font-bold transition hover:bg-red-500"
    >
        Vote Sekarang
        <ArrowIcon />
    </a>
</div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-3 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold transition hover:border-red-500 hover:bg-red-500/10"
                    >
                        Jelajahi Semua Member <ArrowIcon />
                    </a>
                </div>
            </section>

            
{/* FINAL RANKING: LAST COMPLETED PERIOD */}
<section id="ranking" className="border-y border-white/10 bg-[#110b0f]">
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
        <SectionTitle
            eyebrow="Final Senbatsu"
            title="Top 12 Senbatsu"
            description={
                finalSenbatsuPeriod
                    ? `Hasil akhir ${finalSenbatsuPeriod.name} berdasarkan jumlah vote terbanyak.`
                    : 'Peringkat final akan ditampilkan setelah periode voting selesai.'
            }
        />

        {finalSenbatsuPeriod && ranking.length > 0 ? (
            <>
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Periode Terakhir
                    </p>
                    <h3 className="mt-1 text-lg font-black text-white">
                        {finalSenbatsuPeriod.name}
                    </h3>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="grid grid-cols-[60px_1fr_auto] items-center gap-4 bg-white/[0.04] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 sm:grid-cols-[80px_1fr_120px_130px]">
                        <span>Rank</span>
                        <span>Member</span>
                        <span className="hidden sm:block">Team</span>
                        <span className="text-right">Total Vote</span>
                    </div>

                    {ranking.map((member, index) => (
                        <div
                            key={member.id}
                            className="grid grid-cols-[60px_1fr_auto] items-center gap-4 border-t border-white/10 px-5 py-5 transition hover:bg-white/[0.03] sm:grid-cols-[80px_1fr_120px_130px]"
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${
                                    index === 0
                                        ? 'bg-yellow-400 text-black'
                                        : index === 1
                                          ? 'bg-zinc-300 text-black'
                                          : index === 2
                                            ? 'bg-orange-800/60 text-orange-200'
                                            : 'bg-white/5 text-zinc-400'
                                }`}
                            >
                                {member.rank ?? index + 1}
                            </div>

                            <div className="flex min-w-0 items-center gap-3">
                                <MemberPhoto
                                    member={member}
                                    className="h-11 w-11 shrink-0 rounded-xl"
                                />

                                <div className="min-w-0">
                                    <p className="truncate font-bold">
                                        {member.name}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {member.generation
                                            ? `${member.generation} Generation`
                                            : `Team ${member.team ?? '-'}`}
                                    </p>
                                </div>
                            </div>

                            <span className="hidden text-sm text-zinc-400 sm:block">
                                {member.team ?? '-'}
                            </span>

                            <p className="text-right text-sm font-black text-red-300">
                                {new Intl.NumberFormat('id-ID').format(
                                    member.total_votes ?? 0
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className="rounded-2xl border border-white/10 bg-[#151014] px-6 py-12 text-center">
                <h3 className="text-lg font-black">
                    {finalSenbatsuPeriod
                        ? 'Belum ada hasil voting'
                        : 'Belum ada periode yang selesai'}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    {finalSenbatsuPeriod
                        ? 'Belum ada member yang mendapatkan suara pada periode ini.'
                        : 'Hasil Final Senbatsu akan muncul otomatis setelah periode voting berakhir.'}
                </p>
            </div>
        )}
    </div>
</section>


            {/* CTA */}
            <section className="px-5 pb-20 md:px-10 md:pb-24">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-red-400/20 bg-gradient-to-r from-[#6b1026] via-[#3a0d1b] to-[#180b12] px-6 py-12 text-center sm:px-12 sm:py-16">
                    <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-red-400/20 blur-3xl" />

                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-200">
                            This Is Your Moment
                        </p>
                        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black sm:text-5xl">
                            Make Your Oshi Shine.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-300">
                            Satu langkah kecil dari kamu bisa menjadi bagian dari
                            perjalanan besar member favoritmu.
                        </p>

                        <a
                            href="/login"
                            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-black text-red-700 transition hover:bg-red-100"
                        >
                            Login dan Mulai Voting <ArrowIcon />
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-black/30">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
                    <div>
                        <p className="font-black tracking-tight">
                            SSK<span className="text-red-500">.</span>VOTE
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                            Fan voting platform.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
