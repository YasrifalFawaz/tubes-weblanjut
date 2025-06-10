import React from 'react';
import { useForm, Link } from '@inertiajs/react';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface EditProps {
  project: Project;
}

export default function Edit({ project }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: project.name || '',
    description: project.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Langsung gunakan put dengan data yang sudah ada di form
    put(route('projects.update', project.id), {
      onSuccess: () => {
        // Redirect atau tampilkan pesan sukses
        console.log('Project updated successfully');
      },
      onError: (errors) => {
        console.log('Update failed:', errors);
      }
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Proyek</h1>

      <Link
        href={route('projects.index')}
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Kembali ke Daftar Proyek
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Nama Proyek</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={processing}
          />
          {errors.name && (
            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Deskripsi</label>
          <textarea
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={processing}
          />
          {errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {errors.description}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={processing}
          className={`px-4 py-2 rounded text-white font-medium ${
            processing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } transition-colors duration-200`}
        >
          {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}