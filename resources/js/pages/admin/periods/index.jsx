
import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function VotingPeriodIndex({ periods }) {
    const { flash } = usePage().props;

    function closePeriod(period) {
        if (
            window.confirm(
                `Yakin ingin menutup periode "${period.name}"? Statusnya akan menjadi Private / Tutup.`
            )
        ) {
            router.patch(`/admin/periods/${period.id}/close`);
        }
    }

    function formatDate(value) {
        if (!value) return '-';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return value;

        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    function getStatus(period) {
        if (period.status === 'selesai') return 'Selesai';
        if (period.status === 'private') return 'Private / Tutup';

        return 'Published';
    }

    function getStatusClass(period) {
        if (period.status === 'selesai') {
            return 'bg-yellow-500/15 text-yellow-300';
        }

        if (period.status === 'private') {
            return 'bg-gray-500/15 text-gray-300';
        }

        return 'bg-green-500/15 text-green-300';
    }

    const items = periods.data ?? [];

    const publishedCount = items.filter(
        (period) => period.status === 'published'
    ).length;

    const privateCount = items.filter(
        (period) => period.status === 'private'
    ).length;

    const completedCount = items.filter(
        (period) => period.status === 'selesai'
    ).length;

    const cardClass =
        'rounded-2xl border border-white/10 bg-[#151014] p-5 sm:p-6';

    return (
        <AdminLayout>
            <Head title="Periode Voting" />

            <div className="min-h-screen bg-[#0b080a] p-4 text-white sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">

                    {/* HEADER */}
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                                SSK.VOTE ADMIN
                            </p>

                            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                                Periode Voting
                            </h1>

                            <p className="mt-2 text-sm text-gray-400 sm:text-base">
                                Kelola jadwal dan aturan voting setiap periode.
                            </p>
                        </div>

                        <Link
                            href="/admin/periods/create"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                        >
                            + Tambah Periode
                        </Link>
                    </header>

                    {/* FLASH MESSAGE */}
                    {flash?.success && (
                        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                            {flash.success}
                        </div>
                    )}

                    {/* STATISTIK */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Total Periode
                            </p>
                            <p className="mt-3 text-3xl font-bold">
                                {periods.total ?? items.length}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Seluruh periode voting
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Published
                            </p>
                            <p className="mt-3 text-3xl font-bold text-green-400">
                                {publishedCount}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Belum melewati waktu akhir
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Private / Tutup
                            </p>
                            <p className="mt-3 text-3xl font-bold text-gray-300">
                                {privateCount}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Tidak dipublikasikan atau ditutup
                            </p>
                        </div>

                        <div className={cardClass}>
                            <p className="text-sm text-gray-400">
                                Selesai
                            </p>
                            <p className="mt-3 text-3xl font-bold text-yellow-300">
                                {completedCount}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Otomatis setelah waktu berakhir
                            </p>
                        </div>
                    </section>

                    {/* DAFTAR PERIODE */}
                    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                        <div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Daftar Periode
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Kelola periode dan batas suara voter.
                                </p>
                            </div>

                            <span className="text-sm text-gray-400">
                                {periods.total ?? items.length} periode
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="px-5 py-16 text-center sm:px-8">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
                                    🗳️
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    Belum ada periode voting
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                                    Buat periode pertama untuk menentukan jadwal
                                    dan aturan voting SSK.VOTE.
                                </p>

                                <Link
                                    href="/admin/periods/create"
                                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
                                >
                                    + Buat Periode
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-white/[0.03] text-gray-400">
                                        <tr>
                                            <th className="px-5 py-4 font-medium">
                                                Nama Periode
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Waktu Mulai
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Waktu Selesai
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Batas Suara
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Status
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/10">
                                        {items.map((period) => (
                                            <tr
                                                key={period.id}
                                                className="transition hover:bg-white/[0.025]"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-white">
                                                        {period.name}
                                                    </p>
                                                    <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                                        {period.description ||
                                                            'Tanpa deskripsi'}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-gray-300">
                                                    {formatDate(period.start_at)}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-gray-300">
                                                    {formatDate(period.end_at)}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-gray-300">
                                                    {period.votes_per_voter} suara
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(period)}`}
                                                    >
                                                        {getStatus(period)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Link
                                                            href={`/admin/periods/${period.id}/edit`}
                                                            className="font-medium text-red-400 hover:text-red-300"
                                                        >
                                                            Edit
                                                        </Link>

                                                        {period.status === 'published' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => closePeriod(period)}
                                                                className="font-medium text-gray-400 hover:text-white"
                                                            >
                                                                Tutup
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {periods.links && periods.links.length > 3 && (
                            <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
                                {periods.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url || link.active}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        className={`rounded-lg border px-3 py-2 text-sm ${
                                            link.active
                                                ? 'border-red-500 bg-red-600 text-white'
                                                : 'border-white/10 text-gray-300 hover:bg-white/5'
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
