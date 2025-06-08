import { useState, PropsWithChildren, ReactNode, useRef, useEffect } from 'react'; // Tambahkan useRef, useEffect
// Hapus import komponen navbar lama jika Anda tidak lagi menggunakannya
// import ApplicationLogo from '@/Components/ApplicationLogo';
// import Dropdown from '@/Components/Dropdown';
// import NavLink from '@/Components/NavLink';
// import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    // Anda tidak lagi memerlukan state ini jika Anda mengganti navigasi dropdown lama
    // const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // State dan ref untuk navbar dropdown kustom Anda
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Bagian Navbar Baru Anda, diambil dari AuthenticatedSidebarLayout --- */}
            <nav className="flex items-center justify-between bg-white border-b p-4 shadow-sm relative">
                <div className="text-2xl font-bold text-indigo-600">
                    <Link href={route('dashboard')}>WorkNest</Link> {/* Link ke Dashboard */}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="font-medium text-gray-700 hover:text-indigo-600"
                        >
                            {user.name}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
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
            {/* --- Akhir Bagian Navbar Baru --- */}

            {/* Header Konten (tetap dipertahankan) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Konten Utama (children) dari halaman yang menggunakan layout ini */}
            <main>{children}</main>
        </div>
    );
}