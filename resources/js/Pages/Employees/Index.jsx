import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function EmployeeIndex({ auth, employees }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire('Berhasil', 'Akun kasir baru telah dibuat.', 'success');
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Pecat karyawan ini?',
            text: "Akses login mereka akan dicabut.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('employees.destroy', id), {
                    onSuccess: () => Swal.fire('Terhapus', 'Data karyawan dihapus.', 'success')
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Karyawan</h2>}
        >
            <Head title="Karyawan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-700">Daftar Kasir</h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold hover:bg-indigo-700"
                            >
                                + Tambah Kasir
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Nama</th>
                                        <th className="px-4 py-3">Email Login</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Bergabung</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.length > 0 ? employees.map((emp) => (
                                        <tr key={emp.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{emp.name}</td>
                                            <td className="px-4 py-3">{emp.email}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
                                                    {emp.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{new Date(emp.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="text-red-600 hover:text-red-900 font-bold hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6">Belum ada karyawan. Anda bekerja sendiri.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH KARYAWAN */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-down">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Tambah Akun Kasir</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Nama Lengkap</label>
                                <input
                                    type="text" className="w-full border-gray-300 rounded-md" required
                                    value={data.name} onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Email (Untuk Login)</label>
                                <input
                                    type="email" className="w-full border-gray-300 rounded-md" required
                                    value={data.email} onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Password</label>
                                <input
                                    type="password" className="w-full border-gray-300 rounded-md" required
                                    value={data.password} onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Konfirmasi Password</label>
                                <input
                                    type="password" className="w-full border-gray-300 rounded-md" required
                                    value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}