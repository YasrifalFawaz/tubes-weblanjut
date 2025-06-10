import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { Head, usePage, router } from '@inertiajs/react';
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

  const actualUser = auth.user.data;
  const userRoles = actualUser.roles || [];

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
    <AuthenticatedSidebarLayout user={actualUser} title="Manajemen User">
      <Head title="Manajemen User" />

      <div className="py-6">

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
      </div>
    </AuthenticatedSidebarLayout>
  );
}
