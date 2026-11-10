import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Index({ voters, stats = {}, filters = {} }) {
    function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get('/admin/voters', {
            search: formData.get('search') || '',
        }, {
            preserveState: true,
            replace: true,
        });
    }

    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    return (
        <AdminLayout title="Data Voter">
            <Head title="Data Voter" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <header>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                        SSK.VOTE ADMIN
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Data Voter
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Daftar seluruh akun voter yang terdaftar.
                    </p>
                </header>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Voter
                        </p>
                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {(stats.totalVoters ?? 0).toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Akun voter terdaftar
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Suara Digunakan
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">
                            {(stats.totalVotesUsed ?? 0).toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Akumulasi quantity seluruh voter
                        </p>
                    </div>
                </div>

                {/* Pencarian */}
                <section className="rounded-2xl border border-white/10 bg-[#151014] p-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Cari nama atau email voter..."
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500"
                        />

                        <button
                            type="submit"
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
                        >
                            Cari
                        </button>
                    </form>
                </section>

                {/* Tabel */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                    <div className="border-b border-white/10 p-5">
                        <h2 className="font-bold">Daftar Akun Voter</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-5 py-4">Voter</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Tanggal Registrasi</th>
                                    <th className="px-5 py-4">Total Vote</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {!voters?.data?.length ? (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-12 text-center text-gray-400">
                                            Belum ada akun voter.
                                        </td>
                                    </tr>
                                ) : (
                                    voters.data.map((voter) => (
                                        <tr key={voter.id} className="hover:bg-white/[0.03]">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {voter.photo_url ? (
                                                        <img
                                                            src={voter.photo_url}
                                                            alt={voter.name}
                                                            className="h-11 w-11 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950 font-bold text-red-300">
                                                            {voter.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

                                                    <span className="font-semibold text-white">
                                                        {voter.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-300">
                                                {voter.email}
                                            </td>

                                            <td className="px-5 py-4 text-gray-400">
                                                {formatDate(voter.created_at)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-red-950 px-3 py-1 font-bold text-red-300">
                                                    {voter.total_votes.toLocaleString('id-ID')} suara
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {voters?.links && (
                        <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-400">
                                Menampilkan {voters.from ?? 0}–{voters.to ?? 0} dari {voters.total ?? 0} voter
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {voters.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`rounded-lg px-3 py-2 text-sm ${
                                            link.active
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        } disabled:cursor-not-allowed disabled:opacity-30`}
                                    >
                                        {link.label
                                            .replace('&laquo;', '«')
                                            .replace('&raquo;', '»')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}