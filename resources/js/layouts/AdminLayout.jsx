
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Sidebar from '../components/sidebar';

export default function AdminLayout({
    children,
    title = 'SSK.VOTE Admin',
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        if (loggingOut) return;

        setLoggingOut(true);

        router.post('/logout', {}, {
            onFinish: () => setLoggingOut(false),
        });
    };

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-[#0b080a] text-white">
                <Sidebar
                    role="admin"
                    open={sidebarOpen}
                    onClose={closeSidebar}
                    onToggle={toggleSidebar}
                />

                <div
                    className={`min-h-screen transition-[margin] duration-300 ${
                        sidebarOpen ? 'md:ml-72' : 'ml-0'
                    }`}
                >
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#0b080a]/95 px-4 backdrop-blur sm:px-6">
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label={
                                sidebarOpen
                                    ? 'Tutup sidebar'
                                    : 'Buka sidebar'
                            }
                            aria-expanded={sidebarOpen}
                            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl hover:bg-white/10"
                        >
                            {sidebarOpen ? '×' : '☰'}
                        </button>

                        <span className="font-semibold">
                            SSK.VOTE{' '}
                            <span className="text-red-500"> ADMIN</span>
                        </span>

                        <div className="ml-auto">
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="rounded-xl border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loggingOut ? 'Keluar...' : 'Logout'}
                            </button>
                        </div>
                    </header>

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
