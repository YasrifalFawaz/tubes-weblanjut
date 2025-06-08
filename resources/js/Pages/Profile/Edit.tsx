import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react'; // Pastikan Link diimpor
import UpdateProfileInformation from './Partials/UpdateProfileInformationForm'; // Pastikan nama file ini benar
import { PageProps } from '@/types';

export default function Edit() {
    const { auth, status } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between"> {/* Gunakan flexbox untuk mensejajarkan */}
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2> {/* Teks "Profile" */}
                    <Link
                        href={route('dashboard')} // Arahkan ke rute dashboard
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <UpdateProfileInformation
                        // Prop mustVerifyEmail tidak ada di usePage().props.auth.user secara default
                        // Jika Anda tidak menggunakannya atau mengelolanya di backend, Anda bisa menghapusnya
                        // Jika Anda menggunakannya, pastikan data mustVerifyEmail dikirim dari controller
                        mustVerifyEmail={false} // Atur sesuai kebutuhan Anda, atau dapatkan dari props jika dikirim dari controller
                        status={status}
                        className="max-w-xl"
                    />
                    {/* Jika Anda memiliki partials lain seperti UpdatePasswordForm atau DeleteUserForm
                        dan ingin menampilkannya di sini, tambahkan mereka.
                        Contoh:
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}