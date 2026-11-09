
import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import VoterLayout from '../../layouts/VoterLayout';

export default function Profile({ authUser = null }) {
    const { props } = usePage();

    const [preview, setPreview] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);

    // Form foto profil
    const {
        data: photoData,
        setData: setPhotoData,
        post: postPhoto,
        processing: photoProcessing,
        errors: photoErrors,
    } = useForm({
        photo: null,
    });

    // Form informasi akun
    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: authUser?.name ?? '',
    });

    // Form ubah password
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const name = authUser?.name ?? 'Voter';

    const initials = name
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const currentPhoto = preview || authUser?.photo_url || null;

    // Membersihkan URL preview
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Memilih foto
    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPhotoData('photo', file);
        setPreview(URL.createObjectURL(file));
    };

    // Menyimpan foto
    const handlePhotoSubmit = (event) => {
        event.preventDefault();

        if (!photoData.photo || photoProcessing) return;

        postPhoto('/profile/photo', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                setPhotoData('photo', null);
            },
        });
    };

    // Menyimpan nama
    const handleProfileSubmit = (event) => {
        event.preventDefault();

        if (profileProcessing) return;

        patchProfile('/profile', {
            preserveScroll: true,
        });
    };

    // Mengubah password
    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (passwordProcessing) return;

        putPassword('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmationPassword(false);
            },
        });
    };

    // Komponen tombol mata
    const EyeButton = ({ visible, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 transition hover:text-white"
            aria-label={visible ? 'Sembunyikan password' : 'Lihat password'}
        >
            {visible ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a14 14 0 0 1-3 3.8" />
                    <path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.3 0 2.5-.3 3.6-.7" />
                </svg>
            )}
        </button>
    );

    return (
        <VoterLayout title="Profil Saya - SSK.VOTE">
            <Head title="Profil Saya" />

            <div className="min-h-screen bg-[#0b080a] px-4 py-8 text-white md:px-8">
                <div className="mx-auto max-w-4xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                        SSK.VOTE
                    </p>

                    <h1 className="mt-2 text-3xl font-black md:text-4xl">
                        Profil Saya
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Kelola informasi dan keamanan akun kamu.
                    </p>

                    {props.flash?.success && (
                        <p className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {props.flash.success}
                        </p>
                    )}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151015]">
                        {/* HEADER PROFIL */}
                        <div className="flex flex-col items-center gap-5 border-b border-white/10 bg-gradient-to-r from-red-950/60 to-transparent p-8 sm:flex-row sm:p-10">
                            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-red-500/40 bg-red-950 text-3xl font-black text-red-300">
                                {currentPhoto ? (
                                    <img
                                        src={currentPhoto}
                                        alt={`Foto profil ${name}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initials || 'V'
                                )}
                            </div>

                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-black">
                                    {name}
                                </h2>

                                <p className="mt-1 break-all text-sm text-gray-400">
                                    {authUser?.email ?? '-'}
                                </p>

                                <span className="mt-3 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                                    VOTER
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8 p-6 md:p-8">
                            {/* FOTO PROFIL */}
                            <section>
                                <h3 className="text-lg font-bold">
                                    Foto Profil
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Pilih gambar JPG, PNG, atau WEBP.
                                    Ukuran maksimal 2 MB.
                                </p>

                                <form onSubmit={handlePhotoSubmit} className="mt-5">
                                    <label
                                        htmlFor="profile-photo"
                                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:border-red-500 hover:bg-white/5"
                                    >
                                        Pilih Foto
                                    </label>

                                    <input
                                        id="profile-photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="sr-only"
                                    />

                                    {photoData.photo && (
                                        <p className="mt-3 break-all text-sm text-gray-300">
                                            File dipilih: {photoData.photo.name}
                                        </p>
                                    )}

                                    {photoErrors.photo && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {photoErrors.photo}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!photoData.photo || photoProcessing}
                                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {photoProcessing
                                            ? 'Menyimpan...'
                                            : 'Simpan Foto Profil'}
                                    </button>
                                </form>
                            </section>

                            {/* INFORMASI AKUN */}
                            <section className="border-t border-white/10 pt-8">
                                <h3 className="text-lg font-bold">
                                    Informasi Akun
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Perbarui nama yang digunakan pada akun kamu.
                                </p>

                                <form
                                    onSubmit={handleProfileSubmit}
                                    className="mt-5 space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-semibold text-gray-300"
                                        >
                                            Nama Lengkap
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(event) =>
                                                setProfileData('name', event.target.value)
                                            }
                                            maxLength={255}
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 text-white outline-none transition focus:border-red-500"
                                            placeholder="Masukkan nama lengkap"
                                        />

                                        {profileErrors.name && (
                                            <p className="mt-2 text-sm text-red-400">
                                                {profileErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-semibold text-gray-300"
                                        >
                                            Email
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            value={authUser?.email ?? ''}
                                            disabled
                                            className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-500 outline-none"
                                        />

                                        <p className="mt-2 text-xs text-gray-500">
                                            Email akun tidak dapat diubah.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:opacity-50 sm:w-auto"
                                    >
                                        {profileProcessing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </button>
                                </form>
                            </section>

                            {/* KEAMANAN AKUN */}
                            <section className="border-t border-white/10 pt-8">
                                <h3 className="text-lg font-bold">
                                    Keamanan Akun
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Ganti password untuk menjaga keamanan akun kamu.
                                </p>

                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="mt-5 space-y-5"
                                >
                                    {/* PASSWORD LAMA */}
                                    <div>
                                        <label
                                            htmlFor="current_password"
                                            className="mb-2 block text-sm font-semibold text-gray-300"
                                        >
                                            Password Lama
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="current_password"
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                value={passwordData.current_password}
                                                onChange={(event) =>
                                                    setPasswordData('current_password', event.target.value)
                                                }
                                                required
                                                className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 pr-14 text-white outline-none transition focus:border-red-500"
                                                placeholder="Masukkan password lama"
                                            />

                                            <EyeButton
                                                visible={showCurrentPassword}
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            />
                                        </div>

                                        {passwordErrors.current_password && (
                                            <p className="mt-2 text-sm text-red-400">
                                                {passwordErrors.current_password}
                                            </p>
                                        )}
                                    </div>

                                    {/* PASSWORD BARU */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-2 block text-sm font-semibold text-gray-300"
                                        >
                                            Password Baru
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                value={passwordData.password}
                                                onChange={(event) =>
                                                    setPasswordData('password', event.target.value)
                                                }
                                                required
                                                className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 pr-14 text-white outline-none transition focus:border-red-500"
                                                placeholder="Minimal 8 karakter"
                                            />

                                            <EyeButton
                                                visible={showNewPassword}
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            />
                                        </div>

                                        {passwordErrors.password && (
                                            <p className="mt-2 text-sm text-red-400">
                                                {passwordErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* KONFIRMASI PASSWORD */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="mb-2 block text-sm font-semibold text-gray-300"
                                        >
                                            Konfirmasi Password Baru
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmationPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                value={passwordData.password_confirmation}
                                                onChange={(event) =>
                                                    setPasswordData('password_confirmation', event.target.value)
                                                }
                                                required
                                                className="w-full rounded-xl border border-white/10 bg-[#0b080a] px-4 py-3 pr-14 text-white outline-none transition focus:border-red-500"
                                                placeholder="Ulangi password baru"
                                            />

                                            <EyeButton
                                                visible={showConfirmationPassword}
                                                onClick={() => setShowConfirmationPassword(!showConfirmationPassword)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {passwordProcessing
                                            ? 'Memproses...'
                                            : 'Ubah Password'}
                                    </button>
                                </form>
                            </section>

                            {/* DETAIL AKUN */}
                            <section className="border-t border-white/10 pt-8">
                                <h3 className="text-lg font-bold">
                                    Detail Akun
                                </h3>

                                <div className="mt-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Bergabung Sejak
                                    </p>

                                    <p className="mt-2 font-semibold">
                                        {authUser?.created_at
                                            ? new Date(authUser.created_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </VoterLayout>
    );
}
