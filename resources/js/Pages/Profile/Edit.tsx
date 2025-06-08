import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdateProfileInformation from './Partials/UpdateProfileInformationForm';
import { PageProps } from '@/types';

export default function Edit() {
    const { auth, status } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <UpdateProfileInformation
                        status={status}
                        className="max-w-xl"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
