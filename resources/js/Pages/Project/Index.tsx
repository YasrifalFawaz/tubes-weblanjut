// resources/js/Pages/Project/Index.tsx
import React, { FormEvent, useState } from 'react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

// Tambahkan interface untuk Anggota Tim yang Ditugaskan
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
    // === START PERUBAHAN INTERFACE ===
    assigned_users?: AssignedUser[]; // Tambahkan properti ini
    // === AKHIR PERUBAHAN INTERFACE ===
}

interface IndexProps extends PageProps {
    projects: Project[];
    auth: {
        user: User;
    };
}

const Index: React.FC<IndexProps> = ({ auth, projects }) => {
    const actualUser = auth.user.data;
    const userRoles = actualUser?.roles || [];

    const hasRole = (roleName: string) => userRoles.includes(roleName);
    const canManageProjects = hasRole('admin') || hasRole('manajer proyek');

    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const { delete: destroyProject } = useForm();

    // Ini adalah useForm untuk status update
    const { processing: statusProcessing } = useForm();

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
    } = useForm({
        name: '',
        description: '',
    });

    const openCreateProjectModal = () => {
        setShowCreateProjectModal(true);
    };

    const closeCreateProjectModal = () => {
        setShowCreateProjectModal(false);
        reset();
    };

    const submitNewProject = (e: FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                closeCreateProjectModal();
            },
        });
    };

    const openEditProjectModal = (project: Project) => {
        setSelectedProject(project);
        setEditData({
            name: project.name,
            description: project.description,
        });
        setShowEditProjectModal(true);
    };

    const closeEditProjectModal = () => {
        setShowEditProjectModal(false);
        resetEditForm();
    };

    const submitEditProject = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;
        put(route('projects.update', selectedProject.id), {
            data: editData,
            onSuccess: () => {
                closeEditProjectModal();
            },
        });
    };

    // Fungsi untuk mengubah status proyek
    const markAsCompleted = (projectId: number) => {
        if (confirm('Yakin ingin mengubah status proyek ini menjadi selesai?')) {
            setUpdatingStatusId(projectId);

            router.put(route('projects.update-status', projectId),
                { status: 'completed' },
                {
                    preserveState: false,
                    preserveScroll: true,
                    onSuccess: () => {
                        setUpdatingStatusId(null);
                        console.log('Status berhasil diubah menjadi completed');
                    },
                    onError: (errors) => {
                        setUpdatingStatusId(null);
                        console.error('Error:', errors);
                        alert('Gagal mengubah status proyek. Silakan coba lagi.');
                    },
                    onFinish: () => {
                        setUpdatingStatusId(null);
                    }
                }
            );
        }
    };

    const markAsProgress = (projectId: number) => {
        if (confirm('Yakin ingin mengubah status proyek ini menjadi dalam progress?')) {
            setUpdatingStatusId(projectId);

            router.put(route('projects.update-status', projectId),
                { status: 'progress' },
                {
                    preserveState: false,
                    preserveScroll: true,
                    onSuccess: () => {
                        setUpdatingStatusId(null);
                        console.log('Status berhasil diubah menjadi progress');
                    },
                    onError: (errors) => {
                        setUpdatingStatusId(null);
                        console.error('Error:', errors);
                        alert('Gagal mengubah status proyek. Silakan coba lagi.');
                    },
                    onFinish: () => {
                        setUpdatingStatusId(null);
                    }
                }
            );
        }
    };

    const deleteProject = (projectId: number) => {
        if (confirm('Yakin ingin menghapus proyek ini?')) {
            destroyProject(route('projects.destroy', projectId), {
                onSuccess: () => {
                    alert('Proyek berhasil dihapus!');
                },
            });
        }
    };

    return (
        <AuthenticatedSidebarLayout user={actualUser} title="Daftar Proyek">
            <Head title="Daftar Proyek" />

            <p className="mb-4">Halo <strong>{actualUser.name}</strong>, selamat datang di halaman proyek!</p>

            {hasRole('admin') && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded mb-4">
                    Anda adalah Admin. Anda memiliki kontrol penuh atas proyek.
                </div>
            )}
            {hasRole('manajer proyek') && (
                <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded mb-4">
                    Anda adalah Manajer Proyek. Anda dapat mengelola proyek yang ditugaskan.
                </div>
            )}
            {hasRole('anggota tim') && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded mb-4">
                    Anda adalah Anggota Tim. Anda dapat melihat proyek.
                </div>
            )}

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Proyek yang Tersedia</h3>

                        {canManageProjects && (
                            <div className="mb-4 text-right">
                                <PrimaryButton onClick={openCreateProjectModal}>
                                    Buat Proyek Baru
                                </PrimaryButton>
                            </div>
                        )}

                        {projects.length === 0 ? (
                            <p>Belum ada proyek yang tersedia.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {projects.map((project) => {
                                    const isUpdating = updatingStatusId === project.id;

                                    return (
                                        <li key={project.id} className="py-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-md font-semibold">{project.name}</h4>
                                                    <Link
                                                        href={route('projects.show', project.id)}
                                                        className="text-md font-semibold text-indigo-700 hover:underline"
                                                    >
                                                        <h4>{project.name}</h4>
                                                    </Link>
                                                    <p className="text-sm text-gray-600">{project.description}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Dibuat oleh: {project.user.name} | Status:
                                                        <span className={`font-semibold ml-1 ${
                                                            project.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                                        }`}>
                                                            {project.status === 'completed' ? 'Selesai' : 'Dalam Progress'}
                                                        </span>
                                                        {isUpdating && (
                                                            <span className="ml-2 text-blue-600 animate-pulse">
                                                                (Memproses...)
                                                            </span>
                                                        )}
                                                        {/* === START PERUBAHAN UNTUK MENAMPILKAN ANGGOTA TIM === */}
                                                        {project.assigned_users && project.assigned_users.length > 0 && (
                                                            <span className="ml-2 text-gray-700">
                                                                | Ditugaskan: {project.assigned_users.map(u => u.name).join(', ')}
                                                            </span>
                                                        )}
                                                        {/* === AKHIR PERUBAHAN UNTUK MENAMPILKAN ANGGOTA TIM === */}
                                                    </p>
                                                </div>

                                                {canManageProjects && (
                                                    <div className="flex space-x-2">
                                                        {/* Tombol untuk mengubah status */}
                                                        {project.status === 'progress' ? (
                                                            <button
                                                                onClick={() => markAsCompleted(project.id)}
                                                                disabled={isUpdating}
                                                                className={`text-xs border rounded px-2 py-1 transition-colors ${
                                                                    isUpdating
                                                                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                                                        : 'text-indigo-600 border-indigo-400 hover:bg-indigo-50'
                                                                }`}
                                                            >
                                                                {isUpdating ? 'Memproses...' : 'Tandai Selesai'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => markAsProgress(project.id)}
                                                                disabled={isUpdating}
                                                                className={`text-xs border rounded px-2 py-1 transition-colors ${
                                                                    isUpdating
                                                                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                                                        : 'text-yellow-600 border-yellow-400 hover:bg-yellow-50'
                                                                }`}
                                                            >
                                                                {isUpdating ? 'Memproses...' : 'Tandai Progress'}
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => openEditProjectModal(project)}
                                                            disabled={isUpdating}
                                                            className="text-blue-600 text-xs border border-blue-400 rounded px-2 py-1 hover:bg-blue-50 disabled:opacity-50"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => deleteProject(project.id)}
                                                            disabled={isUpdating}
                                                            className="text-red-600 text-xs border border-red-400 rounded px-2 py-1 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Create Project */}
            <Modal show={showCreateProjectModal} onClose={closeCreateProjectModal}>
                <form onSubmit={submitNewProject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Buat Proyek Baru</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="projectName" value="Nama Proyek" />
                        <TextInput
                            id="projectName"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="projectDescription" value="Deskripsi" />
                        <textarea
                            id="projectDescription"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows={4}
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCreateProjectModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            {processing ? 'Memproses...' : 'Buat Proyek'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Project */}
            <Modal show={showEditProjectModal} onClose={closeEditProjectModal}>
                <form onSubmit={submitEditProject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Proyek</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="editProjectName" value="Nama Proyek" />
                        <TextInput
                            id="editProjectName"
                            type="text"
                            name="name"
                            value={editData.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setEditData('name', e.target.value)}
                        />
                        <InputError message={editErrors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="editProjectDescription" value="Deskripsi" />
                        <textarea
                            id="editProjectDescription"
                            name="description"
                            value={editData.description}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows={4}
                            onChange={(e) => setEditData('description', e.target.value)}
                        ></textarea>
                        <InputError message={editErrors.description} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeEditProjectModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={editProcessing}>
                            {editProcessing ? 'Memproses...' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedSidebarLayout>
    );
};

export default Index;