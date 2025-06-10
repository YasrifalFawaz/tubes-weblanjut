import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { PageProps } from '@/types';

export default function Index() {
  const { auth, users, roles, success } = usePage<PageProps<any>>().props;

  const handleDelete = (id: number) => {
    if (confirm('Yakin mau hapus user ini?')) {
      router.delete(route('admin.users.destroy', id));
    }
  };

  return (
    <AuthenticatedSidebarLayout user={auth.user.data} title="User Management">
      <Head title="User Management" />

      {success && <div className="p-2 bg-green-200 mb-4">{success}</div>}

      <div className="mb-4">
        <a href={route('admin.users.create')} className="px-3 py-2 bg-blue-600 text-white rounded">Tambah User</a>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.roles[0]?.name}</td>
              <td className="border p-2">
                <a href={route('admin.users.edit', user.id)} className="text-blue-600 mr-2">Edit</a>
                <button onClick={() => handleDelete(user.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AuthenticatedSidebarLayout>
  );
}
