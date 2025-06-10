import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';

// Pertahankan interface User ini jika Anda belum memiliki types/index.d.ts
// Jika Anda memiliki types/index.d.ts dan ingin menggunakannya,
// pastikan itu sesuai dengan user?.data?.name
// Contoh minimal (sesuaikan dengan properti user yang Anda kirim dari Laravel)
interface User {
    id: number;
    name: string; // Properti ini sebenarnya dari user.data.name
    email: string; // Properti ini sebenarnya dari user.data.email
    data?: { // Menambahkan properti 'data' opsional jika itu yang dikirim
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        roles?: string[];
    };
    // tambahkan properti lain yang ada di objek user Anda, seperti roles, email_verified_at, dll.
    // Jika roles langsung ada di level user (bukan user.data.roles), tambahkan di sini
    roles?: string[];
    email_verified_at?: string | null;
}

interface LayoutProps {
    children: ReactNode;
    title?: string;
    user: User; // Menggunakan interface User yang lebih spesifik
}

export default function AuthenticatedLayout({ children, title, user }: LayoutProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // console.log("User data (in layout):", user); // Debugging
    // console.log("User name (via user?.data?.name):", user?.data?.name); // Debugging

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
        <>
            <Head title={title || 'WorkNest'} />

            {/* Navbar Anda */}
            <nav className="flex items-center justify-between bg-white border-b p-4 shadow-sm relative">
                <div className="text-2xl font-bold text-indigo-600">
                    WorkNest
                </div>

                <div className="flex items-center space-x-4">
                    {/* Div yang membungkus tombol dan dropdown. Ini harus memiliki position: relative */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            // Menghapus kelas yang berpotensi menyebabkan masalah rendering teks
                            // Menambahkan padding dan rounded-md untuk tampilan yang lebih baik
                            className="font-medium text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md focus:outline-none"
                            type="button" // Penting untuk Accessibility
                        >
                            {user?.data?.name} {/* Tetap gunakan user?.data?.name sesuai permintaan */}
                            {/* Ikon panah (opsional) */}
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

                        {/* Dropdown content */}
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

            {/* Main content */}
            <main>{children}</main>
        </>
    );
}