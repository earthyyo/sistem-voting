
import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function MemberForm({ member, generations, teams }) {
    const isEditing = Boolean(member);

    const {
        data,
        setData,
        post,
        transform,
        processing,
        errors,
    } = useForm({
        name: member?.name ?? '',
        description: member?.description ?? '',
        birth_place: member?.birth_place ?? '',
        birth_date: member?.birth_date ?? '',
        generation: member?.generation ?? '',
        team: member?.team ?? '',
        photo: null,
    });

    const [photoPreview, setPhotoPreview] = useState(
        member?.photo_url ?? null
    );

    // Preview foto yang dipilih
    useEffect(() => {
        if (!data.photo) {
            setPhotoPreview(member?.photo_url ?? null);
            return;
        }

        const imageUrl = URL.createObjectURL(data.photo);
        setPhotoPreview(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);
    }, [data.photo, member?.photo_url]);

    // Submit form
    function handleSubmit(event) {
        event.preventDefault();

        if (processing) {
            return;
        }

        if (isEditing) {
            transform((formData) => ({
                ...formData,
                _method: 'put',
            }));

            post(`/admin/members/${member.id}`, {
                forceFormData: true,

                onSuccess: () => {
                    console.log('Member berhasil diperbarui');
                },

                onError: (errors) => {
                    console.log('Error update member:', errors);
                },
            });

            return;
        }

        post('/admin/members', {
            forceFormData: true,

            onSuccess: () => {
                console.log('Member berhasil ditambahkan');
            },

            onError: (errors) => {
                console.log('Error tambah member:', errors);
            },
        });
    }

    const inputClass =
        'mt-2 w-full rounded-xl border border-white/10 bg-[#100c0f] px-4 py-3 text-white outline-none transition focus:border-red-500';

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Member' : 'Tambah Member'} />

            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-bold tracking-[0.3em] text-red-500">
                        SSK.VOTE ADMIN
                    </p>

                    <h1 className="mt-3 text-3xl font-bold">
                        {isEditing ? 'Edit Member' : 'Tambah Member'}
                    </h1>

                    <p className="mt-2 text-gray-400">
                        {isEditing
                            ? 'Perbarui informasi member JKT48.'
                            : 'Masukkan informasi member JKT48 ke sistem.'}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-5 rounded-2xl border border-white/10 bg-[#151014] p-6"
                >
                    {/* Nama member */}
                    <div>
                        <label className="text-sm text-gray-300">
                            Nama member *
                        </label>

                        <input
                            type="text"
                            className={inputClass}
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            required
                            maxLength={120}
                            placeholder="Masukkan nama member"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Generasi dan tim */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-sm text-gray-300">
                                Generasi *
                            </label>

                            <select
                                className={inputClass}
                                value={data.generation}
                                onChange={(e) =>
                                    setData('generation', e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih generasi</option>

                                {generations.map((generation) => (
                                    <option
                                        key={generation}
                                        value={generation}
                                    >
                                        Generasi {generation}
                                    </option>
                                ))}
                            </select>

                            {errors.generation && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.generation}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">
                                Tim *
                            </label>

                            <select
                                className={inputClass}
                                value={data.team}
                                onChange={(e) =>
                                    setData('team', e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih tim</option>

                                {teams.map((team) => (
                                    <option key={team} value={team}>
                                        {team}
                                    </option>
                                ))}
                            </select>

                            {errors.team && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.team}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tempat dan tanggal lahir */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-sm text-gray-300">
                                Tempat lahir
                            </label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.birth_place}
                                onChange={(e) =>
                                    setData('birth_place', e.target.value)
                                }
                                maxLength={100}
                                placeholder="Contoh: Jakarta"
                            />

                            {errors.birth_place && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.birth_place}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">
                                Tanggal lahir
                            </label>

                            <input
                                type="date"
                                className={inputClass}
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData('birth_date', e.target.value)
                                }
                                max={new Date().toLocaleDateString('en-CA')}
                            />

                            {errors.birth_date && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.birth_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="text-sm text-gray-300">
                            Deskripsi
                        </label>

                        <textarea
                            className={inputClass}
                            rows={4}
                            maxLength={3000}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Informasi singkat tentang member"
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Upload foto */}
                    <div>
                        <label className="text-sm text-gray-300">
                            Foto member (maks. 2 MB)
                        </label>

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-red-500"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setData('photo', file);
                            }}
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Format JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                            {isEditing &&
                                ' Kosongkan jika ingin mempertahankan foto lama.'}
                        </p>

                        {errors.photo && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.photo}
                            </p>
                        )}

                        {/* Preview foto */}
                        {photoPreview && (
                            <div className="mt-4">
                                <p className="mb-2 text-sm text-gray-400">
                                    Preview foto member
                                </p>

                                <img
                                    src={photoPreview}
                                    alt={`Foto ${data.name || 'member'}`}
                                    className="h-48 w-40 rounded-xl border border-white/10 object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Error umum */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                            <p className="text-sm font-semibold text-red-400">
                                Gagal menyimpan data. Periksa kembali input kamu.
                            </p>
                        </div>
                    )}

                    {/* Tombol aksi */}
                    <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                        <Link
                            href="/admin/members"
                            className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEditing
                                    ? 'Simpan Perubahan'
                                    : 'Simpan Member'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
