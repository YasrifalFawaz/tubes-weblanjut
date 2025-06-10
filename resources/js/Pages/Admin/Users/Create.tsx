import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedSidebarLayout from '@/Pages/Layouts/AuthenticatedSidebarLayout';
import { PageProps } from '@/types';

export default function Create() {
  const { auth, roles } = usePage<PageProps<any>>().props;

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  return (
    <AuthenticatedSidebarLayout user={auth.user.data} title="Tambah User">
      <Head title="Tambah User" />


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
          <label>Password</label>
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
          Simpan
        </button>
      </form>
    </AuthenticatedSidebarLayout>
  );
}
