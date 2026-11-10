
import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Index({
    votes,
    periods = [],
    stats = {},
    filters = {},
}) {
    function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(
            '/admin/votes',
            {
                search: formData.get('search') || '',
                period_id: filters.period_id || '',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function handlePeriodChange(event) {
        router.get(
            '/admin/votes',
            {
                search: filters.search || '',
                period_id: event.target.value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    return (
        <AdminLayout title="Data Vote">
            <Head title="Data Vote" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                {/* Header */}
                <header>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                        SSK.VOTE ADMIN
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Data Vote
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Rekap jumlah suara setiap member berdasarkan periode voting.
                    </p>
                </header>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Suara
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {Number(stats.totalVotes ?? 0).toLocaleString('id-ID')}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Total suara pada periode yang dipilih
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151014] p-5">
                        <p className="text-sm text-gray-400">
                            Total Member Mendapat Suara
                        </p>

                        <p className="mt-2 text-3xl font-bold text-white">
                            {(votes?.total ?? 0).toLocaleString('id-ID')}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Jumlah member dalam hasil rekap
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
                        <label
                            htmlFor="period_id"
                            className="mb-2 block text-sm text-gray-400"
                        >
                            Filter Periode
                        </label>

                        <select
                            id="period_id"
                            value={filters.period_id ?? ''}
                            onChange={handlePeriodChange}
                            disabled={periods.length === 0}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500 disabled:opacity-50 sm:max-w-md"
                        >
                            {periods.length === 0 ? (
                                <option value="">
                                    Belum ada periode berlangsung atau selesai
                                </option>
                            ) : (
                                periods.map((period) => (
                                    <option
                                        key={period.id}
                                        value={period.id}
                                        className="bg-[#151014]"
                                    >
                                        {period.name}
                                        {period.status === 'closed' ||
                                        new Date(period.end_at) < new Date()
                                            ? ' (Selesai)'
                                            : ' (Berlangsung)'}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </section>

                {/* Tabel Rekap Vote */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                    <div className="border-b border-white/10 p-5">
                        <h2 className="font-bold">
                            Rekap Suara Member
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Setiap member ditampilkan satu kali berdasarkan total suara yang diterima.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px] text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-5 py-4">
                                        Member
                                    </th>

                                    <th className="px-5 py-4">
                                        Jumlah Suara
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {!votes?.data?.length ? (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="px-5 py-12 text-center text-gray-400"
                                        >
                                            Belum ada suara pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    votes.data.map((vote) => (
                                        <tr
                                            key={vote.id}
                                            className="transition hover:bg-white/[0.03]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {vote.member_photo ? (
                                                        <img
                                                            src={vote.member_photo}
                                                            alt={vote.member_name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950 font-bold text-red-300">
                                                            {vote.member_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || '?'}
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

                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-lg bg-red-950 px-3 py-1.5 font-bold text-red-300">
                                                    {Number(vote.quantity).toLocaleString('id-ID')} suara
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {votes?.links && (
                        <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-400">
                                Menampilkan {votes.from ?? 0}–{votes.to ?? 0} dari{' '}
                                {votes.total ?? 0} member
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {votes.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.visit(link.url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
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
