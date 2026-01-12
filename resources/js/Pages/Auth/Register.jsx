import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        business_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Daftar Toko Baru" />

            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900">Mulai Trial Gratis 🚀</h3>
                <p className="text-gray-500 text-sm mt-1">Daftarkan toko Anda dalam 1 menit</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                
                {/* Input Nama Bisnis */}
                <div>
                    <InputLabel htmlFor="business_name" value="Nama Bisnis / Toko" />
                    <TextInput
                        id="business_name"
                        name="business_name"
                        value={data.business_name}
                        className="mt-1 block w-full py-2.5 px-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="organization"
                        isFocused={true}
                        onChange={(e) => setData('business_name', e.target.value)}
                        required
                        placeholder="Contoh: Kopi Senja"
                    />
                    <InputError message={errors.business_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama Pemilik" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full py-2.5 px-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Nama Lengkap Anda"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full py-2.5 px-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="email@bisnis.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full py-2.5 px-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Ulangi Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full py-2.5 px-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-3 text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/30 transition-all" 
                        disabled={processing}
                    >
                        Buat Akun Toko
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                        Masuk Disini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}