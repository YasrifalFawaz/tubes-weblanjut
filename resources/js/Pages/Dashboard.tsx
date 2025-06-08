import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
  const actualUser = auth.user.data;
  const userRoles = actualUser.roles || [];

  const hasRole = (roleName: string) => userRoles.includes(roleName);

  return (
    <AuthenticatedSidebarLayout user={actualUser} title="Dashboard">
      <p>Halo <strong>{actualUser.name}</strong>, selamat datang di WorkNest!</p>
      
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
