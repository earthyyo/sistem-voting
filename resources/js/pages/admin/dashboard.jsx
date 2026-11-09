
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../layouts/AdminLayout';

function StatCard({ title, value, description, icon }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#151015] p-5 transition hover:border-red-500/40">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="mt-3 text-3xl font-black text-white">
                        {value ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/15 text-xl text-red-400">
                    {icon}
                </div>
            </div>
        </div>
    );
}

const statusStyles = {
    draft: 'bg-yellow-500/10 text-yellow-400',
    published: 'bg-green-500/10 text-green-400',
    closed: 'bg-gray-500/10 text-gray-400',
};

const statusLabels = {
    draft: 'Draft',
    published: 'Published',
    closed: 'Closed',
};

export default function AdminDashboard({
    stats,
    recentPeriods = [],
}) {
    return (
        <AdminLayout title="Dashboard Admin | SSK.VOTE">
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-[#0b080a] px-4 py-8 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div>
                        <p className="text-xs font-bold tracking-[0.25em] text-red-500">
                            SSK.VOTE / ADMIN
                        </p>

                        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Ringkasan sistem dan aktivitas voting.
                        </p>
                    </div>

                    {/* Statistik utama */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold">
                            Ringkasan Sistem
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Total Member"
                                value={stats?.members}
                                description={`${stats?.active_members ?? 0} member aktif`}
                                icon="♙"
                            />

                            <StatCard
                                title="Total Voter"
                                value={stats?.voters}
                                description="Akun pemilih terdaftar"
                                icon="♧"
                            />

                            <StatCard
                                title="Total Vote"
                                value={stats?.votes}
                                description="Suara yang tersimpan"
                                icon="✓"
                            />

                            <StatCard
                                title="Total Periode"
                                value={stats?.periods?.total}
                                description={`${stats?.periods?.ongoing ?? 0} periode sedang berlangsung`}
                                icon="▣"
                            />
                        </div>
                    </section>

                    {/* Status periode */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold">
                            Status Periode Voting
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-[#151015] p-5">
                                <p className="text-sm text-gray-400">Draft</p>
                                <p className="mt-2 text-2xl font-black text-yellow-400">
                                    {stats?.periods?.draft ?? 0}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-[#151015] p-5">
                                <p className="text-sm text-gray-400">Published</p>
                                <p className="mt-2 text-2xl font-black text-green-400">
                                    {stats?.periods?.published ?? 0}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-[#151015] p-5">
                                <p className="text-sm text-gray-400">Closed</p>
                                <p className="mt-2 text-2xl font-black text-gray-300">
                                    {stats?.periods?.closed ?? 0}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Periode terbaru */}
                    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151015]">
                        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Periode Voting Terbaru
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Lima periode terakhir yang dibuat.
                                </p>
                            </div>

                            <Link
                                href="/admin/periods"
                                className="inline-flex w-fit items-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold transition hover:bg-red-500"
                            >
                                Kelola Periode →
                            </Link>
                        </div>

                        {recentPeriods.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left text-sm">
                                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="px-5 py-4">Nama Periode</th>
                                            <th className="px-5 py-4">Mulai</th>
                                            <th className="px-5 py-4">Selesai</th>
                                            <th className="px-5 py-4">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5">
                                        {recentPeriods.map((period) => (
                                            <tr
                                                key={period.id}
                                                className="transition hover:bg-white/[0.02]"
                                            >
                                                <td className="px-5 py-4 font-semibold text-white">
                                                    {period.name}
                                                </td>
                                                <td className="px-5 py-4 text-gray-400">
                                                    {period.start_at ?? '—'}
                                                </td>
                                                <td className="px-5 py-4 text-gray-400">
                                                    {period.end_at ?? '—'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            statusStyles[period.status] ??
                                                            'bg-white/10 text-gray-300'
                                                        }`}
                                                    >
                                                        {statusLabels[period.status] ??
                                                            period.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <p className="text-gray-300">
                                    Belum ada periode voting.
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Buat periode baru untuk mulai mengelola voting.
                                </p>
                                <Link
                                    href="/admin/periods/create"
                                    className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold hover:bg-red-500"
                                >
                                    + Buat Periode
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Aksi cepat */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold">Aksi Cepat</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Link
                                href="/admin/members"
                                className="group rounded-2xl border border-white/10 bg-[#151015] p-5 transition hover:border-red-500/40"
                            >
                                <p className="font-bold transition group-hover:text-red-400">
                                    Kelola Member →
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Tambah, edit, dan kelola data member.
                                </p>
                            </Link>

                            <Link
                                href="/admin/periods/create"
                                className="group rounded-2xl border border-white/10 bg-[#151015] p-5 transition hover:border-red-500/40"
                            >
                                <p className="font-bold transition group-hover:text-red-400">
                                    Buat Periode Voting →
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Siapkan periode voting baru.
                                </p>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
