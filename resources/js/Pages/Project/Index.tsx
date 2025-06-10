// resources/js/Pages/Project/Index.tsx
import React, { FormEvent, useState } from 'react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout'; // Keep this import path
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, User } from '@/types'; // Ensure User is imported from types

import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

// Interface for a Project object (remains unchanged)
interface Project {
    id: number;
    name: string;
    description: string;
    user_id: number;
    user: { // The user who created this specific project
        id: number;
        name: string;
    };
    status: 'progress' | 'completed';
}

// Props interface for the Index component
interface IndexProps extends PageProps {
    projects: Project[]; // Array of projects to display
    auth: {
        user: User; // Authenticated user data, structured as per your backend (with 'data' property)
    };
}

const Index: React.FC<IndexProps> = ({ auth, projects }) => {
    // Extract actual user data and roles from auth.user.data for this component's logic
    const actualUser = auth.user.data;
    const userRoles = actualUser?.roles || []; // Use optional chaining for 'data' and fallback to empty array

    // Helper function to check if the user has a specific role
    const hasRole = (roleName: string) => userRoles.includes(roleName);

    // Determine if the user can manage projects (admin or project manager)
    const canManageProjects = hasRole('admin') || hasRole('manajer proyek');

    // State for controlling the visibility of the "Create Project" modal
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

    // useForm hook for handling new project form data
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    // Handler to open the create project modal
    const openCreateProjectModal = () => {
        setShowCreateProjectModal(true);
    };

    // Handler to close the modal and reset the form
    const closeCreateProjectModal = () => {
        setShowCreateProjectModal(false);
        reset(); // Reset form fields after closing
    };

    // Handler for submitting the new project form
    const submitNewProject = (e: FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                closeCreateProjectModal(); // Close modal on successful creation
                // Inertia automatically refreshes page props after redirect from controller
            },
            onError: () => {
                // Errors will be displayed automatically by InputError components
            },
        });
    };

    return (
        // *** THE CRITICAL CHANGE IS HERE: Pass auth.user.data as the 'user' prop ***
        <AuthenticatedSidebarLayout
            user={actualUser} // Pass the 'actualUser' (which is auth.user.data) to the layout
            title="Daftar Proyek" // Title to display in the main content area via sidebar layout
        >
            <Head title="Daftar Proyek" /> {/* Head title for browser tab/SEO */}

            {/* Welcome message and role-specific info, similar to Dashboard */}
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

            {/* Main content area for projects list */}
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Proyek yang Tersedia</h3>

                        {/* "Buat Proyek Baru" button - visible only to admin/project manager */}
                        {canManageProjects && (
                            <div className="mb-4 text-right">
                                <PrimaryButton onClick={openCreateProjectModal}>
                                    Buat Proyek Baru
                                </PrimaryButton>
                            </div>
                        )}

                        {/* Display project list or "no projects" message */}
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
                                        {/* Edit/Delete/Update Status buttons - visible only to admin/project manager */}
                                        {canManageProjects && (
                                            <div className="flex space-x-2">
                                                {project.status === 'progress' && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Yakin ingin mengubah status proyek ini menjadi selesai?')) {
                                                                // Placeholder for Inertia.put route to update status
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

            {/* Modal for creating a new project */}
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
        </AuthenticatedSidebarLayout>
    );
};

export default Index;