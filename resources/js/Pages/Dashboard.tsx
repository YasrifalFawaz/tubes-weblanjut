import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types'; // Atau definisi lokal Anda

// Hapus UserProps dan DashboardPageProps jika Anda menggunakan PageProps dari '@/types'
// Atau, jika Anda masih pakai definisi lokal, pastikan itu sesuai dengan user: { data: UserPropsFromBackend }
// Contoh:
/*
interface UserDataProps { // Nama disesuaikan agar tidak konflik dengan 'User' global
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles?: string[];
}

interface AuthUserProps {
    data: UserDataProps; // UserResource membungkus user asli dalam 'data'
}

interface DashboardPageProps {
    auth: {
        user: AuthUserProps; // Auth.user sekarang memiliki properti 'data'
    };
}
*/


// Gunakan PageProps jika Anda sudah memodifikasi '@/types/index.d.ts'
export default function Dashboard({ auth }: PageProps) {
// Atau jika Anda masih menggunakan definisi lokal:
// export default function Dashboard({ auth }: DashboardPageProps) {

    // --- PERUBAHAN KRUSIAL DI SINI ---
    // UserResource membungkus objek user asli di dalam properti 'data'.
    // Jadi, kita perlu mengakses auth.user.data
    const actualUser = auth.user.data; // <--- PERUBAHAN INI!
    const userRoles = actualUser.roles || []; // <--- GUNAKAN actualUser

    // Fungsi helper untuk memeriksa apakah user memiliki peran tertentu
    const hasRole = (roleName: string): boolean => {
        return userRoles.includes(roleName);
    };

    return (
        <AuthenticatedLayout
            user={actualUser} // <--- PASTIKAN INI ADALAH actualUser untuk AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p>You're logged in!</p>

                            {/* --- Tambahkan informasi user dan peran --- */}
                            <p className="mt-2">Nama Anda: <span className="font-medium">{actualUser.name}</span></p>
                            <p>Email Anda: <span className="font-medium">{actualUser.email}</span></p>
                            {actualUser.email_verified_at && (
                                <p>Email diverifikasi pada: <span className="font-medium">{new Date(actualUser.email_verified_at).toLocaleDateString()}</span></p>
                            )}
                            <p>Peran Anda: <span className="font-medium">{userRoles.join(', ') || 'Tidak ada peran'}</span></p>
                            {/* --- Akhir tambahan informasi user --- */}


                            {/* --- Konten Khusus Berdasarkan Peran --- */}

                            {hasRole('admin') && (
                                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                    <h3 className="font-bold text-lg mb-2">🚀 Area Admin</h3>
                                    <p>Selamat datang, Admin! Anda memiliki akses penuh ke pengaturan sistem.</p>
                                    <a href="/admin/users" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out block mt-2">Kelola Pengguna & Roles</a>
                                </div>
                            )}

                            {(hasRole('manajer proyek') || hasRole('admin')) && (
                                <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
                                    <h3 className="font-bold text-lg mb-2">📈 Area Manajer Proyek</h3>
                                    <p>Anda adalah Manajer Proyek atau Admin. Kelola proyek Anda.</p>
                                    <a href="/projects/create" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out block mt-2">Buat Proyek Baru</a>
                                    <a href="/projects" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out block mt-1">Lihat Semua Proyek</a>
                                </div>
                            )}

                            {hasRole('anggota tim') && (
                                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                    <h3 className="font-bold text-lg mb-2">📋 Area Anggota Tim</h3>
                                    <p>Anda adalah Anggota Tim. Lihat dan perbarui tugas-tugas Anda.</p>
                                    <a href="/tasks" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out block mt-2">Lihat Tugas Saya</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}