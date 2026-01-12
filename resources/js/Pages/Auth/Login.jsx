import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
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

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali 👋</h3>
                <p className="text-gray-500 text-sm mt-1">Masuk untuk mengelola toko Anda</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600 text-center">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full py-3 px-4 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="nama@email.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <InputLabel htmlFor="password" value="Password" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full py-3 px-4 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Ingat Saya</span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-3 text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/30 transition-all" 
                        disabled={processing}
                    >
                        Masuk Sekarang
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                        Daftar Gratis
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}