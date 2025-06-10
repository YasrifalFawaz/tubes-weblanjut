import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { PageProps } from '@/types';

export default function Edit() {
  const { auth, user, roles } = usePage<PageProps<any>>().props;

  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    password: '',
    role: user.roles[0]?.name || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.users.update', user.id));
  };

  return (
    <AuthenticatedSidebarLayout user={auth.user.data} title="Edit User">
      <Head title="Edit User" />


      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label>Nama</label>
          <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
            className="border p-2 w-full" />
          {errors.name && <div className="text-red-600">{errors.name}</div>}
        </div>

        <div>
          <label>Email</label>
          <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
            className="border p-2 w-full" />
          {errors.email && <div className="text-red-600">{errors.email}</div>}
        </div>

        <div>
          <label>Password (opsional)</label>
          <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
            className="border p-2 w-full" />
          {errors.password && <div className="text-red-600">{errors.password}</div>}
        </div>

        <div>
          <label>Role</label>
          <select value={data.role} onChange={e => setData('role', e.target.value)}
            className="border p-2 w-full">
            <option value="">Pilih Role</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
          {errors.role && <div className="text-red-600">{errors.role}</div>}
        </div>

        <button type="submit" disabled={processing}
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Update
        </button>
      </form>
    </AuthenticatedSidebarLayout>
  );
}
