
import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function VotingPeriodForm({ period, statuses = [] }) {
    const isEditing = Boolean(period);

    const { data, setData, errors, processing } = useForm({
        name: period?.name ?? '',
        description: period?.description ?? '',
        start_at: period?.start_at ?? '',
        end_at: period?.end_at ?? '',
        votes_per_voter: period?.votes_per_voter ?? 1,
        status: period?.status === 'published' ? 'published' : 'private',
    });

    function handleSubmit(event) {
        event.preventDefault();

        const url = isEditing
            ? `/admin/periods/${period.id}`
            : '/admin/periods';

        const payload = isEditing
            ? { ...data, _method: 'put' }
            : data;

        router.post(url, payload);
    }

    const inputClass =
        'mt-2 block w-full min-w-0 rounded-xl border border-white/10 bg-[#100c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20';

    const labelClass = 'text-sm font-medium text-gray-300';

    const statusOptions = [
        {
            value: 'published',
            label: 'Published',
            description: 'Periode dipublikasikan dan dapat berlangsung sesuai jadwal.',
        },
        {
            value: 'private',
            label: 'Private / Tutup',
            description: 'Periode tidak dipublikasikan dan voting tidak dapat dilakukan.',
        },
    ];

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Periode' : 'Tambah Periode'} />

            <div className="min-h-screen bg-[#0b080a] p-4 text-white sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl space-y-6">

                    {/* HEADER */}
                    <header>
                        <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                            SSK.VOTE ADMIN
                        </p>

                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                            {isEditing
                                ? 'Edit Periode Voting'
                                : 'Tambah Periode Voting'}
                        </h1>

                        <p className="mt-2 text-sm text-gray-400 sm:text-base">
                            Atur jadwal dan ketentuan voting untuk periode ini.
                        </p>
                    </header>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-2xl border border-white/10 bg-[#151014] p-5 shadow-xl sm:p-8"
                    >
                        {/* NAMA PERIODE */}
                        <div>
                            <label className={labelClass}>
                                Nama periode *
                            </label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Contoh: SSK 2026"
                                maxLength={150}
                                required
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* DESKRIPSI */}
                        <div>
                            <label className={labelClass}>
                                Deskripsi
                            </label>

                            <textarea
                                className={inputClass}
                                rows={4}
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                                placeholder="Informasi mengenai periode voting"
                                maxLength={5000}
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* JADWAL */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="min-w-0">
                                <label className={labelClass}>
                                    Waktu mulai *
                                </label>

                                <input
                                    type="datetime-local"
                                    className={inputClass}
                                    value={data.start_at}
                                    onChange={(event) =>
                                        setData('start_at', event.target.value)
                                    }
                                    required
                                />

                                {errors.start_at && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.start_at}
                                    </p>
                                )}
                            </div>

                            <div className="min-w-0">
                                <label className={labelClass}>
                                    Waktu selesai *
                                </label>

                                <input
                                    type="datetime-local"
                                    className={inputClass}
                                    value={data.end_at}
                                    onChange={(event) =>
                                        setData('end_at', event.target.value)
                                    }
                                    min={data.start_at || undefined}
                                    required
                                />

                                {errors.end_at && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.end_at}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* BATAS VOTE */}
                        <div>
                            <label className={labelClass}>
                                Batas total suara per voter *
                            </label>

                            <input
                                type="number"
                                min="1"
                                max="1000"
                                step="1"
                                className={inputClass}
                                value={data.votes_per_voter}
                                onChange={(event) =>
                                    setData(
                                        'votes_per_voter',
                                        event.target.value
                                    )
                                }
                                required
                            />

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                Contoh: 5 berarti satu akun boleh memberikan
                                maksimal 5 suara dalam periode ini.
                            </p>

                            {errors.votes_per_voter && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.votes_per_voter}
                                </p>
                            )}
                        </div>

                        {/* STATUS PERIODE */}
                        <div>
                            <label className={labelClass}>
                                Status periode *
                            </label>

                            <select
                                className={inputClass}
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                required
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                Status Selesai akan berubah otomatis ketika
                                waktu periode sudah melewati batas akhir.
                            </p>

                            {errors.status && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.status}
                                </p>
                            )}

                            {/* KETERANGAN STATUS */}
                            <div className="mt-4 space-y-2">
                                {statusOptions.map((status) => (
                                    <div
                                        key={status.value}
                                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
                                    >
                                        <span
                                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                                status.value === 'published'
                                                    ? 'bg-green-400'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {status.label}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                {status.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TOMBOL */}
                        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                            <Link
                                href="/admin/periods"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 font-medium text-gray-300 transition hover:bg-white/5"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEditing
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Periode'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
