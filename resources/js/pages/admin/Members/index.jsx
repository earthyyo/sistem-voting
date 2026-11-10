
import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Index({ members, filters = {} }) {
    const { flash = {} } = usePage().props;

    function handleSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(
            '/admin/members',
            {
                search: formData.get('search') || '',
                include_inactive: filters.include_inactive ? 1 : 0,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function toggleInactive(event) {
        router.get(
            '/admin/members',
            {
                search: filters.search || '',
                include_inactive: event.target.checked ? 1 : 0,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function deactivateMember(member) {
        const confirmed = window.confirm(
            `Yakin ingin menonaktifkan ${member.name}?`
        );

        if (!confirmed) return;

        router.patch(`/admin/members/${member.id}/deactivate`, {}, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout title="Kelola Member">
            <Head title="Kelola Member" />

            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                            SSK.VOTE ADMIN
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Kelola Member
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Tambah, edit, dan kelola data member JKT48.
                        </p>
                    </div>

                    <Link
                        href="/admin/members/create"
                        className="rounded-xl bg-red-600 px-5 py-3 text-center font-semibold transition hover:bg-red-500"
                    >
                         Tambah Member
                    </Link>
                </header>

                {flash.success && (
                    <div className="rounded-xl border border-green-800 bg-green-950/50 p-4 text-green-300">
                        {flash.success}
                    </div>
                )}

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
                            className="rounded-xl bg-white/10 px-5 py-3 font-semibold hover:bg-white/15"
                        >
                            Cari
                        </button>
                    </form>

                    <label className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={Boolean(filters.include_inactive)}
                            onChange={toggleInactive}
                            className="accent-red-600"
                        />
                        Tampilkan member nonaktif
                    </label>
                </section>

                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-5 py-4">Member</th>
                                    <th className="px-5 py-4">Generasi</th>
                                    <th className="px-5 py-4">Tim</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {!members?.data?.length ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-12 text-center text-gray-400"
                                        >
                                            Belum ada data member.
                                            <br />
                                            Klik Tambah Member untuk memasukkan data pertama.
                                        </td>
                                    </tr>
                                ) : (
                                    members.data.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-white/[0.03]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {member.photo_url ? (
                                                        <img
                                                            src={member.photo_url}
                                                            alt={member.name}
                                                            className="h-11 w-11 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950 font-bold text-red-300">
                                                            {member.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {member.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {member.birth_place || 'Tempat lahir belum diisi'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-300">
                                                Generasi {member.generation}
                                            </td>

                                            <td className="px-5 py-4 text-gray-300">
                                                {member.team}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        member.is_active
                                                            ? 'bg-green-950 text-green-300'
                                                            : 'bg-gray-800 text-gray-400'
                                                    }`}
                                                >
                                                    {member.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/admin/members/${member.id}/edit`}
                                                        className="font-semibold text-red-400 hover:text-red-300"
                                                    >
                                                        Edit
                                                    </Link>

                                                    {member.is_active && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deactivateMember(member)}
                                                            className="text-gray-400 hover:text-red-300"
                                                        >
                                                            Nonaktifkan
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {members?.links && (
                        <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-400">
                                Menampilkan {members.from ?? 0}–{members.to ?? 0} dari {members.total ?? 0} member
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {members.links.map((link, index) => (
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
