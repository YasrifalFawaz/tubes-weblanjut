// resources/js/Pages/Project/Task/Show.tsx
import React, { useState, FormEvent } from 'react'; // Tambahkan FormEvent
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // Pastikan useForm diimpor
import { PageProps, User } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton'; // Pastikan diimpor
import SecondaryButton from '@/Components/SecondaryButton'; // Pastikan diimpor

// Definisi interface untuk Task
interface Task {
    id: number;
    name: string;
    description: string;
    user_id: number;
    user: { // User yang ditugaskan ke task
        id: number;
        name: string;
    };
    projek_id: number; // Sesuai dengan nama kolom di DB
    status: 'to_do' | 'in_progress' | 'finished';
    created_at: string;
    updated_at: string;
}

// Tambahkan definisi untuk User yang ditugaskan
interface AssignedUser {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    user_id: number;
    user: {
        id: number;
        name: string;
    };
    status: 'progress' | 'completed';
    created_at: string;
    updated_at: string;
    tasks: Task[];
    assigned_users: AssignedUser[]; // Tambahkan ini
}

interface ShowProps extends PageProps {
    project: Project; // Prop yang akan diterima adalah satu objek proyek
    auth: {
        user: User;
    };
    allUsers: AssignedUser[]; // Daftar semua user untuk dropdown penugasan
}

const Show: React.FC<ShowProps> = ({ auth, project, allUsers }) => {
    const actualUser = auth.user.data;
    const userRoles = actualUser?.roles || [];
    const hasRole = (roleName: string) => userRoles.includes(roleName);
    const canAssignUsers = hasRole('admin') || hasRole('manajer proyek'); // Hanya admin/manajer yang bisa assign

    // Filter tasks berdasarkan status
    const toDoTasks = project.tasks.filter(task => task.status === 'to_do');
    const inProgressTasks = project.tasks.filter(task => task.status === 'in_progress');
    const finishedTasks = project.tasks.filter(task => task.status === 'finished');

    // State dan form untuk penugasan anggota tim
    const {
        data: assignData,
        setData: setAssignData,
        put: sendAssignment, // Menggunakan put untuk update penugasan
        processing: assignProcessing,
        errors: assignErrors,
        reset: resetAssignmentForm
    } = useForm({
        user_ids: project.assigned_users.map(u => u.id) as number[] // Inisialisasi dengan user yang sudah ditugaskan
    });

    // Handle submit untuk penugasan anggota tim
    const submitAssignment = (e: FormEvent) => {
        e.preventDefault();
        sendAssignment(route('projects.assign-users', project.id), {
            onSuccess: () => {
                alert('Anggota tim berhasil ditugaskan!');
                // Inertia akan refresh props secara otomatis
            },
            onError: (errors) => {
                console.error('Gagal menugaskan anggota tim:', errors);
                alert('Gagal menugaskan anggota tim. Silakan coba lagi.');
            }
        });
    };

    const renderTaskCard = (task: Task) => (
        <div key={task.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 shadow-sm">
            <h5 className="font-semibold text-gray-800 text-md">{task.name}</h5>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            <p className="text-gray-500 text-xs mt-2">Ditugaskan ke: {task.user.name}</p>
            <p className="text-gray-500 text-xs">Status: {task.status.replace(/_/g, ' ').toUpperCase()}</p>
            <div className="flex justify-end space-x-2 mt-3">
                {/* Tombol edit/delete task bisa ditambahkan di sini, dengan kondisi otorisasi */}
                <button className="text-blue-500 hover:text-blue-700 text-xs">Edit</button>
                <button className="text-red-500 hover:text-red-700 text-xs">Hapus</button>
            </div>
        </div>
    );

    return (
        <AuthenticatedSidebarLayout
            user={actualUser}
            title={project.name}
        >
            <Head title={project.name} />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                        <p className="text-gray-700 mb-4">{project.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <p><span className="font-semibold">ID Proyek:</span> {project.id}</p>
                                <p><span className="font-semibold">Dibuat Oleh:</span> {project.user.name}</p>
                                <p><span className="font-semibold">Status Proyek:</span>
                                    <span className={`font-semibold ml-1 ${
                                        project.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {project.status === 'completed' ? 'Selesai' : 'Dalam Progress'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Dibuat Pada:</span> {new Date(project.created_at).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Terakhir Diperbarui:</span> {new Date(project.updated_at).toLocaleDateString()}</p>
                            </div>
                            {/* Tampilkan daftar anggota tim yang ditugaskan */}
                            <div>
                                <p><span className="font-semibold">Anggota Tim:</span></p>
                                {project.assigned_users.length === 0 ? (
                                    <p className="text-gray-500">Belum ada anggota tim ditugaskan.</p>
                                ) : (
                                    <ul className="list-disc list-inside">
                                        {project.assigned_users.map(assignedUser => (
                                            <li key={assignedUser.id}>{assignedUser.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href={route('projects.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Kembali ke Daftar Proyek
                            </Link>
                        </div>
                    </div>

                    {/* Form untuk Menugaskan Anggota Tim (Hanya Admin/Manajer Proyek) */}
                    {canAssignUsers && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h4 className="font-bold text-lg mb-4 text-gray-800">Tugaskan Anggota Tim</h4>
                            <form onSubmit={submitAssignment}>
                                <div className="mb-4">
                                    <label htmlFor="user_ids" className="block text-sm font-medium text-gray-700 mb-1">
                                        Pilih Anggota Tim (Tahan Ctrl/Cmd untuk pilih banyak)
                                    </label>
                                    <select
                                        id="user_ids"
                                        multiple
                                        value={assignData.user_ids}
                                        onChange={(e) => {
                                            const selectedOptions = Array.from(e.target.selectedOptions);
                                            setAssignData('user_ids', selectedOptions.map(option => parseInt(option.value)));
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        style={{ minHeight: '150px' }} // Agar multiple select terlihat
                                    >
                                        {allUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    {assignErrors.user_ids && <p className="text-red-500 text-sm mt-1">{assignErrors.user_ids}</p>}
                                </div>
                                <div className="flex justify-end">
                                    <PrimaryButton type="submit" disabled={assignProcessing}>
                                        {assignProcessing ? 'Menugaskan...' : 'Tugaskan Anggota Tim'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}


                    {/* Task Board */}
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Daftar Tugas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* To Do Column */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h4 className="font-bold text-lg mb-4 text-gray-800">To Do ({toDoTasks.length})</h4>
                            {toDoTasks.length === 0 ? (
                                <p className="text-gray-500 text-sm">Tidak ada tugas dalam status To Do.</p>
                            ) : (
                                <div>
                                    {toDoTasks.map(renderTaskCard)}
                                </div>
                            )}
                        </div>

                        {/* In Progress Column */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h4 className="font-bold text-lg mb-4 text-gray-800">In Progress ({inProgressTasks.length})</h4>
                            {inProgressTasks.length === 0 ? (
                                <p className="text-gray-500 text-sm">Tidak ada tugas dalam status In Progress.</p>
                            ) : (
                                <div>
                                    {inProgressTasks.map(renderTaskCard)}
                                </div>
                            )}
                        </div>

                        {/* Finished Column */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h4 className="font-bold text-lg mb-4 text-gray-800">Finished ({finishedTasks.length})</h4>
                            {finishedTasks.length === 0 ? (
                                <p className="text-gray-500 text-sm">Tidak ada tugas dalam status Finished.</p>
                            ) : (
                                <div>
                                    {finishedTasks.map(renderTaskCard)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedSidebarLayout>
    );
};

export default Show;