import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function TenantIndex({ auth, tenants, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // Handle Search dengan Enter
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('super.tenants.index'), { search }, { preserveState: true });
        }
    };

    // Handle Suspend/Activate
    // Handle Suspend/Activate
    const handleToggle = (tenant) => {
        const isSuspended = tenant.status === 'suspended';

        const action = isSuspended ? 'Aktifkan' : 'Suspend';
        const color = isSuspended ? '#3085d6' : '#d33';

        Swal.fire({
            title: `${action} Toko Ini?`,
            text: `Status toko saat ini adalah "${tenant.status}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: color,
            confirmButtonText: `Ya, ${action}!`
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('super.tenants.toggle', tenant.id));
            }
        });
    };

    // Handle Delete Permanen
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Permanen?',
            text: "Data toko dan transaksi tidak bisa kembali!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('super.tenants.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Toko (Tenants)</h2>}
        >
            <Head title="Manajemen Toko" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* Search Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    className="border-gray-300 rounded-md shadow-sm w-full pl-10"
                                    placeholder="Cari nama toko..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </div>

                        {/* Tabel Tenants */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Nama Toko</th>
                                        <th className="px-4 py-3">Pemilik</th>
                                        <th className="px-4 py-3 text-center">Produk</th>
                                        <th className="px-4 py-3 text-center">Transaksi</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.data.length > 0 ? tenants.data.map((tenant) => (
                                        <tr key={tenant.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-gray-900">{tenant.name}</div>
                                                {/* Tampilkan Status Kecil di bawah nama */}
                                                <div className="text-xs text-gray-400 capitalize">{tenant.status}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>{tenant.user?.name}</div>
                                                <div className="text-xs text-gray-400">{tenant.user?.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {tenant.products_count}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {tenant.transactions_count}
                                                </span>
                                            </td>

                                            {/* KOLOM STATUS YANG DIPERBAIKI */}
                                            <td className="px-4 py-3 text-center">
                                                {tenant.status === 'active' && (
                                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                                        ACTIVE
                                                    </span>
                                                )}
                                                {tenant.status === 'trial' && (
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                                        TRIAL
                                                    </span>
                                                )}
                                                {tenant.status === 'suspended' && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                                        SUSPENDED
                                                    </span>
                                                )}
                                                {/* Fallback kalau statusnya aneh */}
                                                {!['active', 'trial', 'suspended'].includes(tenant.status) && (
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                                        {tenant.status}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    onClick={() => handleToggle(tenant)}
                                                    className={`font-bold text-xs px-3 py-1 rounded border transition 
                                                        ${tenant.status === 'suspended'
                                                            ? 'border-green-500 text-green-600 hover:bg-green-50'
                                                            : 'border-red-500 text-red-600 hover:bg-red-50'
                                                        }`}
                                                >
                                                    {tenant.status === 'suspended' ? 'Aktifkan' : 'Suspend'}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(tenant.id)}
                                                    className="text-gray-400 hover:text-red-600"
                                                    title="Hapus Permanen"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-gray-400">
                                                Belum ada toko yang terdaftar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-center">
                            {tenants.links.map((link, key) => (
                                <Link
                                    key={key}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 mx-1 border rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}