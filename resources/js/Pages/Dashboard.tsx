// resources/js/Pages/Dashboard.tsx
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types'; // Pastikan PageProps diimpor

// Tambahkan definisi props untuk Dashboard
interface DashboardProps extends PageProps {
    totalProjects: number;
    totalTasks: number;
    tasksToDo: number;
    tasksInProgress: number;
    tasksFinished: number;
}

// Gunakan DashboardProps
export default function Dashboard({ auth, totalProjects, totalTasks, tasksToDo, tasksInProgress, tasksFinished }: DashboardProps) {
    const actualUser = auth.user.data;
    const userRoles = actualUser?.roles || []; // Gunakan optional chaining untuk safety
    const hasRole = (roleName: string) => userRoles.includes(roleName);

    return (
        <AuthenticatedSidebarLayout user={actualUser} title="Dashboard">
            <Head title="Dashboard" />

            <p className="mb-4 text-lg">Halo <strong>{actualUser.name}</strong>, selamat datang di WorkNest!</p>

            {/* Bagian Ringkasan Statistik */}
            <div className="mb-6 p-6 bg-white shadow-sm sm:rounded-lg">
                <h3 className="font-semibold text-xl text-gray-800 leading-tight mb-4">Ringkasan Statistik</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Kartu Total Proyek */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-blue-700">{totalProjects}</span>
                        <span className="text-sm text-blue-600 mt-1">Total Proyek</span>
                    </div>
                    {/* Kartu Total Tugas */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-purple-700">{totalTasks}</span>
                        <span className="text-sm text-purple-600 mt-1">Total Tugas</span>
                    </div>
                    {/* Kartu Tugas To Do */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-red-700">{tasksToDo}</span>
                        <span className="text-sm text-red-600 mt-1">Tugas To Do</span>
                    </div>
                    {/* Kartu Tugas In Progress */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-yellow-700">{tasksInProgress}</span>
                        <span className="text-sm text-yellow-600 mt-1">Tugas Dalam Progress</span>
                    </div>
                    {/* Kartu Tugas Finished */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-green-700">{tasksFinished}</span>
                        <span className="text-sm text-green-600 mt-1">Tugas Selesai</span>
                    </div>
                </div>
            </div>

            {/* Area Pesan Berdasarkan Peran */}
            {hasRole('admin') && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
                    Area Admin: Kelola sistem di sini.
                </div>
            )}
            {hasRole('manajer proyek') && (
                <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
                    Area Manajer Proyek: Lihat semua proyek Anda.
                </div>
            )}
            {hasRole('anggota tim') && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
                    Area Anggota Tim: Cek tugas-tugas Anda.
                </div>
            )}
        </AuthenticatedSidebarLayout>
    );
}