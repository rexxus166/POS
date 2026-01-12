import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// Helper Format Rupiah
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

// Helper Format Tanggal
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function TransactionHistory({ auth, transactions, filters }) {
    // State untuk Filter Tanggal
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // Fungsi saat tombol "Filter" diklik
    const handleFilter = () => {
        router.get(route('transaction.history'), {
            start_date: startDate,
            end_date: endDate
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Fungsi Reset Filter
    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        router.get(route('transaction.history'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Transaksi</h2>}
        >
            <Head title="Riwayat Transaksi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* --- BAGIAN FILTER TANGGAL --- */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Dari Tanggal</label>
                                <input
                                    type="date"
                                    className="border-gray-300 rounded-md shadow-sm"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    className="border-gray-300 rounded-md shadow-sm"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700"
                                >
                                    Cari Data
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-bold hover:bg-gray-300"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* --- TABEL TRANSAKSI --- */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Waktu</th>
                                        <th className="px-4 py-3">No. Invoice</th>
                                        <th className="px-4 py-3">Kasir</th>
                                        <th className="px-4 py-3">Metode Bayar</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length > 0 ? (
                                        transactions.data.map((trx) => (
                                            <tr key={trx.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{formatDate(trx.created_at)}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{trx.invoice_code}</td>
                                                <td className="px-4 py-3">{trx.cashier?.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs text-white font-bold ${trx.payment_method === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                        {trx.payment_method.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                    {formatRupiah(trx.total_amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={route('transaction.receipt', trx.invoice_code)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-bold hover:underline"
                                                    >
                                                        Lihat Struk
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">Tidak ada data transaksi ditemukan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION --- */}
                        <div className="mt-6 flex justify-center">
                            {transactions.links.map((link, key) => (
                                <Link
                                    key={key}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 mx-1 border rounded text-sm ${link.active
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
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