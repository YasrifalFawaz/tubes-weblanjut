import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { User } from '@/types'; // Pastikan User diimpor dari types

interface LayoutProps {
    children: ReactNode;
    title?: string;
    user: User;
}

export default function AuthenticatedLayoutWithSidebar({ children, title, user }: LayoutProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // State untuk sidebar
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userName = user.data?.name || user.name;
    const userRoles = user.data?.roles || user.roles || [];

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Effect untuk mengatur sidebar secara responsif
    useEffect(() => {
        const handleResize = () => {
            // Tutup sidebar secara otomatis di layar kecil
            if (window.innerWidth < 768) { // Ukuran MD (768px) dari Tailwind
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil sekali saat komponen di-mount untuk inisialisasi awal

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head title={title || 'WorkNest'} />

            {/* Navbar */}
            <nav className="flex items-center justify-between bg-white border-b p-4 shadow-sm relative z-10">
                <div className="flex items-center">
                    {/* Tombol Hamburger/Sidebar Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 mr-4 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden" // Hanya terlihat di layar kecil
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <div className="text-2xl font-bold text-indigo-600">
                        WorkNest
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="font-medium text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md focus:outline-none"
                        >
                            {userName}
                            <svg
                                className="ms-1 -me-0.5 h-4 w-4 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                                <Link
                                    href={route('profile.edit')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Keluar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Kontainer Sidebar & Main Content */}
            <div className="flex min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className={`bg-white border-r flex-col transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'w-64 flex' : 'w-0 hidden md:flex' // Di layar kecil sembunyikan sepenuhnya
                } md:flex`}> {/* Pastikan sidebar selalu flex di layar MD ke atas jika sidebarOpen true */}
                    <nav className="flex-1 p-4 space-y-2">
                        <Link href={route('dashboard')} className="block py-2 px-3 rounded hover:bg-indigo-50 transition-colors">
                            📊 Dashboard
                        </Link>
                        <Link href={route('projects.index')} className="block py-2 px-3 rounded hover:bg-indigo-50 transition-colors">
                            📁 Proyek
                        </Link>
                        {/* Kondisi untuk Manajemen User (Hanya Admin) */}
                        {userRoles.includes('admin') && (
                            <Link href={route('admin.users.index')} className="block py-2 px-3 rounded hover:bg-indigo-50 transition-colors">
                                ⚙ Manajemen User
                            </Link>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
                    {children}
                </div>
            </div>
        </>
    );
}