import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Index({ votes, periods = [], stats = {}, filters = {} }) {
    const { url } = usePage();

    function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get('/admin/votes', {
            search: formData.get('search') || '',
            period_id: filters.period_id || '',
        }, {
            preserveState: true,
            replace: true,
        });
    }

    function handlePeriodChange(event) {
        router.get('/admin/votes', {
            search: filters.search || '',
            period_id: event.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }

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
        <AdminLayout title="Data Vote">
            <Head title="Data Vote" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <header>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                        SSK.VOTE / ADMIN
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Data Vote
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Seluruh transaksi voting dari semua periode.
                    </p>
                </header>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Suara
                        </p>
                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {(stats.totalVotes ?? 0).toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Akumulasi seluruh quantity
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Transaksi
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">
                            {(stats.totalTransactions ?? 0).toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Jumlah transaksi voting
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <section className="rounded-2xl border border-white/10 bg-[#151014] p-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Cari nama member..."
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500"
                        />

                        <button
                            type="submit"
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="mt-3">
                        <select
                            value={filters.period_id || ''}
                            onChange={handlePeriodChange}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500 sm:max-w-xs"
                        >
                            <option value="">Semua Periode</option>
                            {periods.map((period) => (
                                <option key={period.id} value={period.id}>
                                    {period.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Tabel */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                    <div className="border-b border-white/10 p-5">
                        <h2 className="font-bold">Riwayat Transaksi Voting</h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Informasi voter tidak ditampilkan.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-5 py-4">Member</th>
                                    <th className="px-5 py-4">Periode</th>
                                    <th className="px-5 py-4">Jumlah Suara</th>
                                    <th className="px-5 py-4">Tanggal Transaksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {!votes?.data?.length ? (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-12 text-center text-gray-400">
                                            Belum ada transaksi voting.
                                        </td>
                                    </tr>
                                ) : (
                                    votes.data.map((vote) => (
                                        <tr key={vote.id} className="hover:bg-white/[0.03]">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {vote.member_photo ? (
                                                        <img
                                                            src={vote.member_photo}
                                                            alt={vote.member_name}
                                                            className="h-11 w-11 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950 font-bold text-red-300">
                                                            {vote.member_name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {vote.member_name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {vote.member_team || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-300">
                                                {vote.period_name}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-red-950 px-3 py-1 font-bold text-red-300">
                                                    {vote.quantity} suara
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-gray-400">
                                                {formatDate(vote.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {votes?.links && (
                        <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-400">
                                Menampilkan {votes.from ?? 0}–{votes.to ?? 0} dari {votes.total ?? 0} transaksi
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {votes.links.map((link, index) => (
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