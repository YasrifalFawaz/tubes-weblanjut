// resources/js/Pages/Project/Index.tsx
import React, { FormEvent, useState } from 'react'; // Hapus useEffect
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, User } from '@/types';

import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

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
}

interface IndexProps extends PageProps {
    projects: Project[];
    auth: {
        user: User;
    };
    // users: User[]; // <<< HAPUS BARIS INI
}

const Index: React.FC<IndexProps> = ({ auth, projects }) => { // Hapus 'users' dari destructuring props
    const canManageProjects = auth.user.data?.roles?.some(
        (roleName: string) => roleName === 'admin' || roleName === 'manajer proyek'
    ) || false;


    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const openCreateProjectModal = () => { setShowCreateProjectModal(true); };
    const closeCreateProjectModal = () => { setShowCreateProjectModal(false); reset(); };

    const submitNewProject = (e: FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            // ...data, // Hanya kirim name dan description
            onSuccess: () => { closeCreateProjectModal(); },
            onError: () => {},
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Proyek</h2>}
        >
            <Head title="Daftar Proyek" />

            <div className="py-12">
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
                                    {projects.map((project) => (
                                        <li key={project.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="text-md font-semibold">{project.name}</h4>
                                                <p className="text-sm text-gray-600">{project.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Dibuat oleh: {project.user.name} | Status: <span className={`font-semibold ${project.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                    </span>
                                                </p>
                                            </div>
                                            {canManageProjects && (
                                                <div className="flex space-x-2">
                                                    {project.status === 'progress' && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Yakin ingin mengubah status proyek ini menjadi selesai?')) {
                                                                    alert('Fungsi update status belum diimplementasikan sepenuhnya. Anda perlu menambahkan route dan Inertia.put');
                                                                }
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Tandai Selesai
                                                        </button>
                                                    )}
                                                    <Link href={`/projects/${project.id}/edit`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                                                    <button className="text-red-600 hover:text-red-900">Hapus</button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk Membuat Proyek Baru */}
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
                            {processing ? 'Menyimpan...' : 'Buat Proyek'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default Index;