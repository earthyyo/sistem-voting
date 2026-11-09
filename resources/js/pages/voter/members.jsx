
import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';

// ==============================
// TOAST NOTIFICATION
// ==============================
function Toast({ toast, onClose }) {
    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className="fixed right-4 top-5 z-[100] w-[calc(100%-2rem)] max-w-sm">
            <div
                className={`flex items-start gap-3 rounded-xl border-l-4 ${
                    isSuccess ? 'border-green-500' : 'border-red-500'
                } bg-[#1b1218] p-4 shadow-2xl`}
                role="alert"
            >
                <span
                    className={`text-xl font-bold ${
                        isSuccess ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                    {isSuccess ? '✓' : '!'}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">{toast.title}</p>
                    <p className="mt-1 text-sm text-gray-300">
                        {toast.message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                    aria-label="Tutup notifikasi"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

// ==============================
// MODAL KONFIRMASI
// ==============================
function VoteConfirmation({
    vote,
    onCancel,
    onConfirm,
    processing,
}) {
    if (!vote) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#191015] p-6 text-white shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-500">
                    ♥
                </div>

                <h2 className="mt-5 text-center text-2xl font-bold">
                    Konfirmasi Voting
                </h2>

                <p className="mt-3 text-center leading-relaxed text-gray-400">
                    Kamu yakin ingin memberikan{' '}
                    <span className="font-bold text-red-500">
                        {vote.quantity} suara
                    </span>{' '}
                    kepada{' '}
                    <span className="font-bold text-white">
                        {vote.member.name}
                    </span>
                    ?
                </p>

                <div className="mt-5 rounded-xl bg-white/5 p-4 text-center">
                    <p className="text-sm text-gray-400">
                        Sisa kuota setelah voting
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-500">
                        {vote.remainingQuota - vote.quantity} suara
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Ya, Vote!'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==============================
// MEMBER CARD
// ==============================
function MemberCard({
    member,
    remainingQuota,
    onVote,
    processing,
}) {
    const [quantity, setQuantity] = useState(1);

    const maxQuantity = Math.max(0, Number(remainingQuota) || 0);

    const selectedQuantity = Number(quantity) || 0;

    const isValid =
        Number.isInteger(selectedQuantity) &&
        selectedQuantity >= 1 &&
        selectedQuantity <= maxQuantity;

    useEffect(() => {
        setQuantity((current) => {
            if (maxQuantity <= 0) return 1;

            return Math.min(
                Math.max(1, Number(current) || 1),
                maxQuantity
            );
        });
    }, [maxQuantity]);

    const updateQuantity = (value) => {
        if (value === '') {
            setQuantity('');
            return;
        }

        const parsedValue = Number(value);

        if (!Number.isFinite(parsedValue)) return;

        setQuantity(
            Math.min(
                maxQuantity,
                Math.max(1, Math.floor(parsedValue))
            )
        );
    };

    const handleVote = () => {
        if (!isValid || processing) return;

        onVote(member, selectedQuantity);
    };

    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#151014] text-white shadow-lg">
            <div className="relative h-60 overflow-hidden bg-[#262026]">
                {member.photo_url ? (
                    <img
                        src={member.photo_url}
                        alt={member.name}
                        className="h-full w-full object-cover object-top"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-white/40">
                        {member.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold backdrop-blur">
                    Generasi {member.generation || '-'}
                </span>

                <span className="absolute right-4 top-4 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold backdrop-blur">
                    {member.team || '-'}
                </span>
            </div>

            <div className="p-6">
                <h2 className="text-2xl font-bold">{member.name}</h2>

                <p className="mt-2 text-gray-400">
                    Member SSK.VOTE
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor={`vote-quantity-${member.id}`}
                            className="text-sm text-gray-300"
                        >
                            Jumlah suara
                        </label>

                        <span className="text-xs text-gray-400">
                            Maks. {maxQuantity}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                updateQuantity(selectedQuantity - 1)
                            }
                            disabled={
                                selectedQuantity <= 1 ||
                                maxQuantity < 1 ||
                                processing
                            }
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl font-bold hover:bg-white/10 disabled:opacity-30"
                        >
                            −
                        </button>

                        <input
                            id={`vote-quantity-${member.id}`}
                            type="number"
                            min="1"
                            max={maxQuantity}
                            step="1"
                            value={quantity}
                            disabled={maxQuantity < 1 || processing}
                            onChange={(event) =>
                                updateQuantity(event.target.value)
                            }
                            className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#211920] text-center text-lg font-bold text-white outline-none focus:border-red-500 disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                updateQuantity(selectedQuantity + 1)
                            }
                            disabled={
                                selectedQuantity >= maxQuantity ||
                                maxQuantity < 1 ||
                                processing
                            }
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl font-bold hover:bg-white/10 disabled:opacity-30"
                        >
                            +
                        </button>
                    </div>

                    {maxQuantity < 1 ? (
                        <p className="mt-3 text-sm text-red-400">
                            Kuota suara kamu sudah habis.
                        </p>
                    ) : (
                        <p className="mt-3 text-xs text-gray-400">
                            Sisa kuota kamu: {maxQuantity} suara
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleVote}
                    disabled={!isValid || processing || maxQuantity < 1}
                    className="mt-6 w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? 'Memproses...' : 'Vote Member →'}
                </button>
            </div>
        </article>
    );
}

// ==============================
// MAIN MEMBERS PAGE
// ==============================
export default function Members({
    members = [],
    votesRemaining = 0,
    activePeriod = null,
}) {
    const [processing, setProcessing] = useState(false);
    const [quota, setQuota] = useState(Number(votesRemaining) || 0);
    const [selectedVote, setSelectedVote] = useState(null);
    const [toast, setToast] = useState(null);

    // Sinkronisasi kuota dengan props dari backend
    useEffect(() => {
        setQuota(Number(votesRemaining) || 0);
    }, [votesRemaining]);

    // Toast otomatis hilang
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    // Buka modal konfirmasi
    const handleVote = (member, quantity) => {
        if (processing) return;

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > quota
        ) {
            setToast({
                type: 'error',
                title: 'Kuota tidak mencukupi!',
                message: 'Jumlah suara melebihi kuota yang tersedia.',
            });

            return;
        }

        setSelectedVote({
            member,
            quantity,
            remainingQuota: quota,
        });
    };

    // Kirim vote ke backend
    const confirmVote = () => {
        if (!selectedVote || processing) return;

        const { member, quantity } = selectedVote;

        setProcessing(true);

        router.post(
            '/votes',
            {
                member_id: member.id,
                quantity: quantity,
            },
            {
                preserveScroll: true,

                onSuccess: (page) => {
                    // Ambil kuota terbaru dari server jika tersedia
                    const serverQuota =
                        page.props.votesRemaining;

                    if (serverQuota !== undefined) {
                        setQuota(Number(serverQuota));
                    } else {
                        setQuota((current) =>
                            Math.max(0, current - quantity)
                        );
                    }

                    setSelectedVote(null);

                    setToast({
                        type: 'success',
                        title: 'Voting berhasil!',
                        message: `${quantity} suara berhasil diberikan kepada ${member.name}.`,
                    });

                    // Reset jumlah pilihan setelah berhasil
                },

                onError: (errors) => {
                    const firstError = Object.values(errors)[0];

                    setSelectedVote(null);

                    setToast({
                        type: 'error',
                        title: 'Voting gagal!',
                        message:
                            firstError ||
                            'Terjadi kesalahan saat menyimpan voting.',
                    });
                },

                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <VoterLayout title="Vote Member - SSK.VOTE">
            <Head title="Vote Member - SSK.VOTE" />

            <main className="min-h-screen bg-[#0c090b] px-4 py-8 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                            SSK.VOTE
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold">
                            Vote Member
                        </h1>

                        <p className="mt-2 text-gray-400">
                            Pilih member favoritmu dan tentukan jumlah
                            suara yang ingin kamu berikan.
                        </p>
                    </div>

                    {/* Informasi kuota */}
                    <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-[#191015] p-5">
                        <div>
                            <p className="text-sm text-gray-400">
                                Sisa kuota suara kamu
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-red-500">
                                {quota}
                                <span className="ml-2 text-base font-medium text-gray-400">
                                    suara
                                </span>
                            </p>
                        </div>

                        <div className="text-sm text-gray-400">
                            Periode:{' '}
                            <span className="font-semibold text-white">
                                {activePeriod?.name || 'Belum ada periode'}
                            </span>
                        </div>
                    </section>

                    {/* Tidak ada periode aktif */}
                    {!activePeriod ? (
                        <div className="rounded-2xl border border-white/10 bg-[#151014] p-8 text-center">
                            <h2 className="text-xl font-bold">
                                Belum ada periode voting aktif
                            </h2>

                            <p className="mt-2 text-gray-400">
                                Silakan kembali lagi ketika periode voting
                                sudah dibuka oleh admin.
                            </p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-[#151014] p-8 text-center">
                            <h2 className="text-xl font-bold">
                                Belum ada member
                            </h2>

                            <p className="mt-2 text-gray-400">
                                Belum ada member yang tersedia untuk dipilih.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {members.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    remainingQuota={quota}
                                    processing={processing}
                                    onVote={handleVote}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Toast
                toast={toast}
                onClose={() => setToast(null)}
            />

            <VoteConfirmation
                vote={selectedVote}
                onCancel={() => setSelectedVote(null)}
                onConfirm={confirmVote}
                processing={processing}
            />
        </VoterLayout>
    );
}
