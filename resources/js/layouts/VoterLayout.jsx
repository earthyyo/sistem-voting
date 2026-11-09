
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../components/sidebar';

export default function VoterLayout({
    children,
    title = 'SSK.VOTE',
    header,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-[#0b080a] text-white">
                <Sidebar
                    role="voter"
                    open={sidebarOpen}
                    onClose={closeSidebar}
                />

                <div
                    className={`min-h-screen min-w-0 transition-[margin] duration-300 ${
                        sidebarOpen ? 'md:ml-72' : 'ml-0'
                    }`}
                >
                    {typeof header === 'function' ? (
                        header({
                            sidebarOpen,
                            toggleSidebar,
                        })
                    ) : (
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
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-2xl text-white transition hover:border-red-500 hover:bg-red-600"
                            >
                                {sidebarOpen ? '×' : '☰'}
                            </button>

                            <span className="font-semibold">
                                {title}
                            </span>
                        </header>
                    )}

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
