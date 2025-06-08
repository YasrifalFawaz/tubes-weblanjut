import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';

interface User {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
}

interface Role {
  id: number;
  name: string;
}

export default function Index() {
  const { auth, users, roles, status } = usePage<PageProps<{ users: User[], roles: Role[], status?: string }>>().props;

  const handleChangeRole = (userId: number, role: string) => {
    router.put(route('admin.users.updateRole', userId), {
      role: role,
    }, {
      onSuccess: () => {
        console.log('Peran berhasil diperbarui!');
      },
      onError: (errors) => {
        console.error(errors);
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manajemen User" />

      <div className="py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manajemen User</h2>

        {status && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{status}</div>}

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  <select
                    defaultValue={user.roles[0]?.name ?? ''}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Pilih Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Kembali</Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
