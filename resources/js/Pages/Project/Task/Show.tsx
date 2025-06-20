// resources/js/Pages/Project/Task/Show.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Pastikan 'router' diimpor
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { User } from '@/types';

// --- Interfaces ---
// Definisi Comment Interface (diperbarui untuk attachment)
interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    user: { // User yang membuat komentar
        id: number;
        name: string;
    };
    content: string;
    attachment_path?: string; // <<< TAMBAHKAN INI (path relatif dari storage/app/public)
    attachment_url?: string; // <<< Opsional: jika Anda membuat accessor di model
    created_at: string;
    updated_at: string;
}

interface Task {
    id: number;
    name: string;
    description: string;
    user_id: number;
    user: {
        id: number;
        name: string;
    };
    projek_id: number;
    status: 'to_do' | 'in_progress' | 'finished';
    created_at: string;
    updated_at: string;
    comments: Comment[]; // Komentar terkait tugas
}

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
    assigned_users: AssignedUser[];
}

interface ShowProps {
    auth: { user: { data: User } };
    project: Project;
    allUsers: AssignedUser[]; // Daftar semua user untuk dropdown penugasan (diasumsikan dikirim dari ProjectController@show)
}

const Show: React.FC<ShowProps> = ({ auth, project, allUsers }) => {
    // --- Otorisasi dan Peran ---
    const actualUser = auth.user.data;
    const userRoles = actualUser?.roles || [];
    const hasRole = (roleName: string) => userRoles.includes(roleName);
    const canAssignUsers = hasRole('admin') || hasRole('manajer proyek');

    const canCreateTasks = canAssignUsers || (hasRole('anggota tim') && project.assigned_users.some(u => u.id === actualUser?.id));
    const canEditDeleteTasks = canAssignUsers || (hasRole('anggota tim') && project.assigned_users.some(u => u.id === actualUser?.id));

    // --- State untuk Mengelola Tugas di Frontend ---
    const [tasks, setTasks] = useState<Task[]>(project.tasks);
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null); // State untuk tugas yang sedang diseret

    // Effect untuk memperbarui state 'tasks' lokal setiap kali prop 'project.tasks' berubah dari Inertia
    useEffect(() => {
        setTasks(project.tasks);
    }, [project.tasks]);

    // Filter tasks berdasarkan status
    const toDoTasks = tasks.filter(task => task.status === 'to_do');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const finishedTasks = tasks.filter(task => task.status === 'finished');

    // --- useForm Instances ---
    const {
        data: assignData,
        setData: setAssignData,
        put: sendAssignment,
        processing: assignProcessing,
        errors: assignErrors,
        reset: resetAssignmentForm
    } = useForm({
        user_ids: project.assigned_users.map(u => u.id),
    });

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const {
        data: createTaskData,
        setData: setCreateTaskData,
        post: sendCreateTask,
        processing: createTaskProcessing,
        errors: createTaskErrors,
        reset: resetCreateTaskForm
    } = useForm({
        name: '', description: '', user_id: '', status: 'to_do',
    });

    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const {
        data: editTaskData,
        setData: setEditTaskData,
        put: sendEditTaskUpdate,
        processing: editTaskProcessing,
        errors: editTaskErrors,
        reset: resetEditTaskForm
    } = useForm({
        name: '', description: '', user_id: '', status: '',
    });

    const { delete: sendDeleteTask, processing: deleteTaskProcessing } = useForm();

    // === START KOMENTAR: State dan Form untuk Menambah Komentar (dengan Attachment) ===
    const [showCommentForm, setShowCommentForm] = useState<number | null>(null);
    const {
        data: commentData,
        setData: setCommentData,
        post: sendComment, // Ini akan digunakan untuk mengirim komentar + file
        processing: commentProcessing,
        errors: commentErrors,
        reset: resetCommentForm
    } = useForm({
        content: '',
        attachment: null as File | null, // <<< TAMBAHKAN INI: Tipe File atau null
    });
    // === AKHIR KOMENTAR ===


    // --- Handlers ---
    const submitAssignment = (e: FormEvent) => {
        e.preventDefault();
        sendAssignment(route('projects.assign-users', project.id), {
            onSuccess: () => { alert('Anggota tim berhasil ditugaskan!'); },
            onError: (errors) => { console.error('Gagal menugaskan anggota tim:', errors); alert('Gagal menugaskan anggota tim. Silakan coba lagi.'); }
        });
    };

    const openCreateTaskModal = () => {
        const defaultUserId = project.assigned_users.some(u => u.id === actualUser?.id) ? actualUser?.id : '';
        setCreateTaskData({
            name: '', description: '', user_id: defaultUserId.toString(), status: 'to_do'
        });
        setShowCreateTaskModal(true);
    };

    const closeCreateTaskModal = () => {
        setShowCreateTaskModal(false);
        resetCreateTaskForm();
    };

    const submitCreateTask = (e: FormEvent) => {
        e.preventDefault();
        sendCreateTask(route('tasks.store', project.id), {
            onSuccess: () => {
                alert('Tugas berhasil ditambahkan!');
                closeCreateTaskModal();
            },
            onError: (errors) => {
                console.error('Gagal membuat tugas:', errors);
                alert('Gagal membuat tugas. Silakan coba lagi.');
            }
        });
    };

    const openEditTaskModal = (task: Task) => {
        setSelectedTask(task);
        setEditTaskData({
            name: task.name, description: task.description, user_id: task.user_id.toString(), status: task.status,
        });
        setShowEditTaskModal(true);
    };

    const closeEditTaskModal = () => {
        setShowEditTaskModal(false);
        resetEditTaskForm();
        setSelectedTask(null);
    };

    const submitEditTask = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        sendEditTaskUpdate(
            route('tasks.update', selectedTask.id),
            {
                name: editTaskData.name,
                description: editTaskData.description,
                user_id: editTaskData.user_id,
                status: editTaskData.status,
                onSuccess: () => {
                    alert('Tugas berhasil diperbarui!');
                    closeEditTaskModal();
                },
                onError: (errors: any) => {
                    console.error('Gagal memperbarui tugas:', errors);
                    alert('Gagal memperbarui tugas. Silakan coba lagi.');
                }
            }
        );
    };

    const deleteTask = (taskId: number) => {
        if (confirm('Yakin ingin menghapus tugas ini?')) {
            sendDeleteTask(route('tasks.destroy', taskId), {
                onSuccess: () => { alert('Tugas berhasil dihapus!'); },
                onError: (errors) => { console.error('Gagal menghapus tugas:', errors); alert('Gagal menghapus tugas. Silakan coba lagi.'); }
            });
        }
    };

    // === START KOMENTAR: Handlers Komentar (diperbarui untuk attachment) ===
    const toggleCommentForm = (taskId: number) => {
        setShowCommentForm(showCommentForm === taskId ? null : taskId); // Toggle form berdasarkan taskId
        resetCommentForm(); // Reset form komentar
        // Pastikan input file direset secara manual jika perlu
        const fileInput = document.getElementById(`attachment-${taskId}`) as HTMLInputElement;
        if (fileInput) fileInput.value = ''; // Mengosongkan input file secara manual
    };

    const submitComment = (e: FormEvent, taskId: number) => {
        e.preventDefault();
        sendComment(route('comments.store', taskId), {
            content: commentData.content,
            attachment: commentData.attachment, // <<< Kirim file attachment
            forceFormData: true, // <<< PENTING: Untuk memastikan data dikirim sebagai FormData
            onSuccess: () => {
                alert('Komentar berhasil ditambahkan!');
                setShowCommentForm(null); // Tutup form komentar
                resetCommentForm();
                // Inertia akan secara otomatis me-refresh props setelah POST, jadi `comments` akan terupdate
            },
            onError: (errors) => {
                console.error('Gagal menambah komentar:', errors);
                alert('Gagal menambah komentar. Silakan coba lagi.');
            }
        });
    };

    const deleteComment = (commentId: number) => {
        if (confirm('Yakin ingin menghapus komentar ini?')) {
            // Menggunakan sendDeleteTask karena sudah didefinisikan sebagai useForm().delete
            // Jika Anda ingin terpisah, bisa buat useForm() baru: const { delete: sendDeleteComment } = useForm();
            sendDeleteTask(route('comments.destroy', commentId), {
                onSuccess: () => { alert('Komentar berhasil dihapus!'); },
                onError: (errors) => { console.error('Gagal menghapus komentar:', errors); alert('Gagal menghapus komentar. Silakan coba lagi.'); }
            }
            // Tambahkan onFinish untuk reset processing state jika diperlukan
            // onFinish: () => { /* ... */ }
            );
        }
    };
    // === AKHIR KOMENTAR ===

    // --- Handlers Drag & Drop Manual ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
        setDraggedTaskId(task.id);
        e.dataTransfer.setData('text/plain', task.id.toString());
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('opacity-50', 'border-indigo-500', 'shadow-xl');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('bg-indigo-50', 'border-indigo-400', 'border-dashed');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-400', 'border-dashed');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: 'to_do' | 'in_progress' | 'finished') => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-400', 'border-dashed');

        const taskId = parseInt(e.dataTransfer.getData('text/plain'));
        const draggedTask = tasks.find(task => task.id === taskId);

        if (!draggedTask || draggedTask.status === targetStatus) {
            setDraggedTaskId(null);
            return;
        }

        const originalTasks = [...tasks];
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, status: targetStatus } : task
        );
        setTasks(updatedTasks);

        router.put(route('tasks.update-status', taskId), { status: targetStatus }, {
            onSuccess: () => {
                console.log(`Status tugas ${draggedTask.name} berhasil diubah menjadi ${targetStatus}`);
            },
            onError: (errors) => {
                console.error('Gagal update status tugas:', errors);
                alert('Gagal update status tugas. Silakan coba lagi.');
                setTasks(originalTasks);
            },
            onFinish: () => {
                const draggedElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (draggedElement) {
                    draggedElement.classList.remove('opacity-50', 'border-indigo-500', 'shadow-xl');
                }
                setDraggedTaskId(null);
            }
        });
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50', 'border-indigo-500', 'shadow-xl');
        setDraggedTaskId(null);
    };

    // Fungsi untuk merender setiap kartu tugas (diperbarui untuk komentar dan drag)
    const renderTaskCard = (task: Task) => (
        <div
            key={task.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, task)}
            onDragEnd={handleDragEnd}
            data-task-id={task.id} // Custom attribute untuk identifikasi di dragEnd
            className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-md cursor-grab"
        >
            <h5 className="font-semibold text-gray-800 text-md">{task.name}</h5>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            <p className="text-gray-500 text-xs mt-2">Ditugaskan ke: {task.user.name}</p>
            <p className="text-gray-500 text-xs">Status: {task.status.replace(/_/g, ' ').toUpperCase()}</p>
            <div className="flex justify-end space-x-2 mt-3">
                {(canEditDeleteTasks && (actualUser?.id === task.user.id || hasRole('admin') || hasRole('manajer proyek'))) && (
                    <>
                        <button
                            onClick={() => openEditTaskModal(task)}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                            disabled={editTaskProcessing || deleteTaskProcessing}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                            disabled={editTaskProcessing || deleteTaskProcessing}
                        >
                            Hapus
                        </button>
                    </>
                )}
            </div>

            {/* Bagian Tampilan Komentar */}
            {task.comments && task.comments.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-3">
                    <h6 className="font-semibold text-gray-700 text-sm mb-2">Komentar ({task.comments.length})</h6>
                    <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                        {task.comments.map(comment => (
                            <div key={comment.id} className="bg-gray-100 rounded-md p-2">
                                <p className="text-gray-800 text-xs font-semibold">{comment.user.name} <span className="font-normal text-gray-500">({new Date(comment.created_at).toLocaleDateString()})</span></p>
                                <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                {/* Tampilkan link attachment jika ada */}
                                {comment.attachment_path && ( // Cek properti attachment_path
                                    <p className="mt-1 text-xs text-blue-600 hover:underline">
                                        {/* Gunakan comment.attachment_url jika Anda membuat accessor di model */}
                                        <a href={`/storage/${comment.attachment_path}`} target="_blank" rel="noopener noreferrer">
                                            Unduh Attachment
                                        </a>
                                    </p>
                                )}
                                {/* Opsi untuk menghapus komentar (jika diizinkan Policy) */}
                                {(hasRole('admin') || hasRole('manajer proyek') || actualUser?.id === comment.user_id) && (
                                    <button
                                        onClick={() => deleteComment(comment.id)} // Menggunakan handler deleteComment
                                        className="text-red-400 hover:text-red-600 text-xs mt-1"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tombol untuk membuka/menutup form komentar */}
            <div className="mt-3 flex justify-end">
                <SecondaryButton
                    onClick={() => toggleCommentForm(task.id)}
                    className="text-xs py-1 px-2"
                >
                    {showCommentForm === task.id ? 'Tutup Komentar' : 'Tambah Komentar'}
                </SecondaryButton>
            </div>

            {/* Form Komentar (muncul jika showCommentForm sesuai dengan task.id) */}
            {showCommentForm === task.id && (
                <form onSubmit={(e) => submitComment(e, task.id)} className="mt-3">
                    <textarea
                        value={commentData.content}
                        onChange={(e) => setCommentData('content', e.target.value)}
                        placeholder="Tulis komentar..."
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                    <InputError message={commentErrors.content} className="mt-1" />

                    {/* Input untuk Lampiran File */}
                    <div className="mt-2">
                        <InputLabel htmlFor={`attachment-${task.id}`} value="Lampirkan File (Max 2MB)" className="mb-1"/>
                        <input
                            id={`attachment-${task.id}`}
                            type="file"
                            onChange={(e) => setCommentData('attachment', e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                        <InputError message={commentErrors.attachment} className="mt-1" />
                    </div>

                    <div className="flex justify-end mt-2 space-x-2">
                        <SecondaryButton onClick={() => toggleCommentForm(task.id)} type="button" className="text-xs">Batal</SecondaryButton>
                        <PrimaryButton type="submit" disabled={commentProcessing} className="text-xs">
                            {commentProcessing ? 'Mengirim...' : 'Kirim Komentar'}
                        </PrimaryButton>
                    </div>
                </form>
            )}
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
                                        style={{ minHeight: '150px' }}
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


                    {/* Task Board Drag-and-Drop */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Daftar Tugas</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* To Do Column */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'to_do')}
                            onDragLeave={handleDragLeave}
                            className="bg-gray-100 rounded-lg shadow-inner p-4 min-h-[200px] border border-gray-300"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg text-gray-800">To Do ({toDoTasks.length})</h4>
                                {canCreateTasks && (
                                    <PrimaryButton onClick={openCreateTaskModal} className="flex items-center justify-center w-8 h-8 p-0">
                                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path>
                                        </svg>
                                    </PrimaryButton>
                                )}
                            </div>
                            {toDoTasks.length === 0 ? (
                                <p className="text-gray-500 text-sm">Tidak ada tugas dalam status To Do.</p>
                            ) : (
                                <div>
                                    {toDoTasks.map(renderTaskCard)}
                                </div>
                            )}
                        </div>

                        {/* In Progress Column */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'in_progress')}
                            onDragLeave={handleDragLeave}
                            className="bg-gray-100 rounded-lg shadow-inner p-4 min-h-[200px] border border-gray-300"
                        >
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
                        <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'finished')}
                            onDragLeave={handleDragLeave}
                            className="bg-gray-100 rounded-lg shadow-inner p-4 min-h-[200px] border border-gray-300"
                        >
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

            {/* Modal untuk Membuat Tugas Baru */}
            <Modal show={showCreateTaskModal} onClose={closeCreateTaskModal}>
                <form onSubmit={submitCreateTask} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Buat Tugas Baru</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="taskName" value="Nama Tugas" />
                        <TextInput
                            id="taskName"
                            type="text"
                            name="name"
                            value={createTaskData.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setCreateTaskData('name', e.target.value)}
                        />
                        <InputError message={createTaskErrors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="taskDescription" value="Deskripsi" />
                        <textarea
                            id="taskDescription"
                            name="description"
                            value={createTaskData.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={4}
                            onChange={(e) => setCreateTaskData('description', e.target.value)}
                        ></textarea>
                        <InputError message={createTaskErrors.description} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="taskAssignedUser" value="Tugaskan Ke" />
                        <select
                            id="taskAssignedUser"
                            name="user_id"
                            value={createTaskData.user_id}
                            onChange={(e) => setCreateTaskData('user_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="">Pilih Pengguna</option>
                            {/* Filter allUsers berdasarkan mereka yang ditugaskan ke proyek */}
                            {project.assigned_users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        <InputError message={createTaskErrors.user_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="taskStatus" value="Status" />
                        <select
                            id="taskStatus"
                            name="status"
                            value={createTaskData.status}
                            onChange={(e) => setCreateTaskData('status', e.target.value as 'to_do' | 'in_progress' | 'finished')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="to_do">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="finished">Finished</option>
                        </select>
                        <InputError message={createTaskErrors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCreateTaskModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={createTaskProcessing}>
                            {createTaskProcessing ? 'Membuat...' : 'Buat Tugas'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal untuk Mengedit Tugas */}
            <Modal show={showEditTaskModal} onClose={closeEditTaskModal}>
                <form onSubmit={submitEditTask} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Tugas</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="editTaskName" value="Nama Tugas" />
                        <TextInput
                            id="editTaskName"
                            type="text"
                            name="name"
                            value={editTaskData.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setEditTaskData('name', e.target.value)}
                        />
                        <InputError message={editTaskErrors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="editTaskDescription" value="Deskripsi" />
                        <textarea
                            id="editTaskDescription"
                            name="description"
                            value={editTaskData.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={4}
                            onChange={(e) => setEditTaskData('description', e.target.value)}
                        ></textarea>
                        <InputError message={editTaskErrors.description} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="editTaskAssignedUser" value="Tugaskan Ke" />
                        <select
                            id="editTaskAssignedUser"
                            name="user_id"
                            value={editTaskData.user_id}
                            onChange={(e) => setEditTaskData('user_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="">Pilih Pengguna</option>
                            {project.assigned_users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        <InputError message={editTaskErrors.user_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="editTaskStatus" value="Status" />
                        <select
                            id="editTaskStatus"
                            name="status"
                            value={editTaskData.status}
                            onChange={(e) => setEditTaskData('status', e.target.value as 'to_do' | 'in_progress' | 'finished')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="to_do">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="finished">Finished</option>
                        </select>
                        <InputError message={editTaskErrors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeEditTaskModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={editTaskProcessing}>
                            {editTaskProcessing ? 'Memproses...' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedSidebarLayout>
    );
};

export default Show;