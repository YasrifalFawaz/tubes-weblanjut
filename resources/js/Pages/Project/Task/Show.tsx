// resources/js/Pages/Project/Show.tsx
import React from 'react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, User } from '@/types';

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
    tasks: Task[]; // Tambahkan tasks ke interface Project
}

interface ShowProps extends PageProps {
    project: Project; // Prop yang akan diterima adalah satu objek proyek
    auth: {
        user: User;
    };
}

const Show: React.FC<ShowProps> = ({ auth, project }) => {
    const actualUser = auth.user.data;

    // Filter tasks berdasarkan status
    const toDoTasks = project.tasks.filter(task => task.status === 'to_do');
    const inProgressTasks = project.tasks.filter(task => task.status === 'in_progress');
    const finishedTasks = project.tasks.filter(task => task.status === 'finished');

    const renderTaskCard = (task: Task) => (
        <div key={task.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 shadow-sm">
            <h5 className="font-semibold text-gray-800 text-md">{task.name}</h5>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            <p className="text-gray-500 text-xs mt-2">Ditugaskan ke: {task.user.name}</p>
            <p className="text-gray-500 text-xs">Status: {task.status.replace(/_/g, ' ').toUpperCase()}</p>
            {/* Anda bisa menambahkan tombol edit/delete task di sini */}
            <div className="flex justify-end space-x-2 mt-3">
                <button className="text-blue-500 hover:text-blue-700 text-xs">Edit</button>
                <button className="text-red-500 hover:text-red-700 text-xs">Hapus</button>
            </div>
        </div>
    );

    return (
        <AuthenticatedSidebarLayout
            user={actualUser}
            title={project.name} // Judul halaman bisa nama proyek
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