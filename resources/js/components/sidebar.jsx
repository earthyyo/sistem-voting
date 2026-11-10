
import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function Sidebar({
    role = 'voter',
    open = false,
    onClose = () => {},
}) {
    const { url } = usePage();
    const isAdmin = role === 'admin';

    const [loggingOut, setLoggingOut] = useState(false);

    const menus = isAdmin
        ? [
              { label: 'Dashboard', href: '/admin/dashboard', icon: '▦' },
              { label: 'Kelola Member', href: '/admin/members', icon: '♙' },
              { label: 'Periode Voting', href: '/admin/periods', icon: '▣' },
              { label: 'Data Vote', href: '/admin/votes', icon: '✓' },
              { label: 'Data Voter', href: '/admin/voters', icon: '♧' },
          ]
        : [
              { label: 'Dashboard', href: '/dashboard', icon: '▦' },
              { label: 'Daftar Member', href: '/members', icon: '♙' },
              { label: 'Ranking', href: '/ranking', icon: '♛' },
              { label: 'Riwayat Periode', href: '/history', icon: '◷' },
              { label: 'Profil Saya', href: '/profile', icon: '♧' },
          ];

    const isActive = (href) =>
        url === href || url.startsWith(`${href}/`);

    const handleLogout = () => {
        if (loggingOut) return;

        setLoggingOut(true);

        router.post(
            '/logout',
            {},
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error('Logout gagal:', errors);
                },
                onFinish: () => {
                    setLoggingOut(false);
                },
            }
        );
    };

    return (
        <>
            {/* Overlay khusus tampilan mobile */}
            {open && (
                <button
                    type="button"
                    aria-label="Tutup sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/70 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#100c0f] text-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
                    <Link
                        href={isAdmin ? '/admin/dashboard' : '/dashboard'}
                        onClick={onClose}
                        className="text-xl font-black tracking-[0.2em]"
                    >
                        <span className="text-red-500">SSK.</span>
                        <span>VOTE</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup sidebar"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-2xl text-gray-300 transition hover:bg-red-600 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* Informasi role */}
                <div className="px-6 pb-3 pt-6">
                    <p className="text-xs font-bold tracking-[0.25em] text-red-500">
                        {isAdmin ? 'ADMIN PANEL' : 'VOTER AREA'}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        {isAdmin
                            ? 'Kelola sistem voting'
                            : 'Dukung member favoritmu'}
                    </p>
                </div>

                {/* Menu navigasi */}
                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                    {menus.map((menu) => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                isActive(menu.href)
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className="w-6 text-center text-lg">
                                {menu.icon}
                            </span>

                            <span>{menu.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer sidebar */}
                <div className="shrink-0 space-y-2 border-t border-white/10 p-4">
                    {/* Kembali ke Home */}
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <span>↩</span>
                        <span>Kembali ke halaman utama</span>
                    </Link>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="w-4 text-center text-lg">⇥</span>
                        <span>{loggingOut ? 'Memproses...' : 'Logout'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
