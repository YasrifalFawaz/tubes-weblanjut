import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler, useRef } from 'react'; // Tambahkan useRef
import { PageProps } from '@/types';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    // --- State untuk Update Informasi Profil (Nama & Email) ---
    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileRecentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
        // Tidak perlu password untuk verifikasi update profil di sini
    });

    // --- State untuk Update Password ---
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword, // Menggunakan PUT karena rute update password biasanya PUT
        errors: passwordErrors,
        processing: passwordProcessing,
        recentlySuccessful: passwordRecentlySuccessful,
        reset: resetPasswordForm,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // --- Handler untuk Update Informasi Profil ---
    const submitProfileUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        patchProfile(route('profile.update'));
    };

    // --- Handler untuk Update Password ---
    const submitPasswordUpdate: FormEventHandler = (e) => {
        e.preventDefault();

        putPassword(route('password.update'), {
            preserveScroll: true, // Agar scroll tidak reset setelah submit
            onSuccess: () => resetPasswordForm(), // Reset form password setelah sukses
            onError: (errors) => { // Fokus pada input error
                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
                if (errors.password) {
                    passwordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            {/* Bagian untuk Update Informasi Profil */}
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submitProfileUpdate} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={profileData.name}
                        onChange={(e) => setProfileData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={profileErrors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={profileData.email}
                        onChange={(e) => setProfileData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={profileErrors.email} />
                </div>

                {/* Bagian verifikasi email, tetap seperti semula */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-1"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={profileProcessing}>Save Profile Information</PrimaryButton>

                    <Transition
                        show={profileRecentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Profile Information Saved.</p>
                    </Transition>
                </div>
            </form>

            <hr className="my-8 border-gray-200" /> {/* Garis pemisah visual */}

            {/* Bagian untuk Update Password */}
            <header className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={submitPasswordUpdate} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError message={passwordErrors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={passwordData.password}
                        onChange={(e) => setPasswordData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={passwordErrors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                    <TextInput
                        id="password_confirmation"
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={passwordErrors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={passwordProcessing}>Save New Password</PrimaryButton>

                    <Transition
                        show={passwordRecentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Password Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}