import { useEffect, FormEventHandler, ReactNode } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Head title="Masuk" />

            {/* Tombol Kembali kiri atas */}
            <button
                type="button"
                onClick={() => window.history.back()}
                className="fixed top-4 left-4 z-50 px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
                &larr; Kembali
            </button>

            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="max-w-md w-full p-8 border border-gray-200 rounded-md shadow-sm">
                    {children}
                </div>
            </div>
        </>
    );
}

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <LoginLayout>
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Masuk ke Akun Anda
            </h2>

            {status && (
                <div className="mb-4 text-center font-medium text-sm text-green-700 bg-green-100 rounded p-2">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email.anda@contoh.com"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Masukkan kata sandi Anda"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>


                <PrimaryButton
                    className="w-full py-3 flex justify-center text-lg font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                    disabled={processing}
                >
                    Masuk
                </PrimaryButton>
            </form>
        </LoginLayout>
    );
}
