import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Atau layout khusus Super Admin kalau mau beda sidebar
import { Head, Link } from '@inertiajs/react';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function SuperDashboard({ auth, stats, latest_stores, latest_transactions }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Super Admin Dashboard</h2>}
        >
            <Head title="Super Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* --- HEADER WELCOME --- */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="text-2xl font-bold">Halo, {auth.user.name}! 👋</h3>
                        <p className="opacity-90 mt-1">Ini adalah pusat kontrol seluruh ekosistem POS SaaS Anda.</p>
                    </div>

                    {/* --- STATISTIK GLOBAL --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Card 1: Total Toko */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Toko Aktif</span>
                            <span className="text-4xl font-extrabold text-indigo-600 mt-2">{stats.total_stores}</span>
                        </div>

                        {/* Card 2: Total User */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Pengguna</span>
                            <span className="text-4xl font-extrabold text-blue-600 mt-2">{stats.total_users}</span>
                        </div>

                        {/* Card 3: Total Transaksi Global */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Transaksi (All Time)</span>
                            <span className="text-4xl font-extrabold text-green-600 mt-2">{stats.total_transactions}</span>
                        </div>

                        {/* Card 4: GMV (Total Uang Berputar) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total GMV System</span>
                            <span className="text-3xl font-extrabold text-gray-800 mt-2">{formatRupiah(stats.total_gmv)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* --- DAFTAR TOKO TERBARU --- */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h4 className="font-bold text-gray-700">🏪 Toko Terbaru Mendaftar</h4>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3">Nama Toko</th>
                                            <th className="px-5 py-3">Pemilik</th>
                                            <th className="px-5 py-3">Bergabung</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latest_stores.length > 0 ? latest_stores.map((store) => (
                                            <tr key={store.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-5 py-3 font-medium text-gray-900">{store.name}</td>
                                                <td className="px-5 py-3 text-gray-600">{store.user?.name || '-'}</td>
                                                <td className="px-5 py-3 text-gray-500">{new Date(store.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="text-center py-4 text-gray-400">Belum ada toko.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- LIVE TRANSAKSI MONITOR --- */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h4 className="font-bold text-gray-700">⚡ Monitor Transaksi Live</h4>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">Live Update</span>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3">Toko</th>
                                            <th className="px-5 py-3">Total</th>
                                            <th className="px-5 py-3">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latest_transactions.length > 0 ? latest_transactions.map((trx) => (
                                            <tr key={trx.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-5 py-3">
                                                    <span className="block font-medium text-gray-900">{trx.tenant?.name}</span>
                                                    <span className="text-xs text-gray-500">Kasir: {trx.cashier?.name}</span>
                                                </td>
                                                <td className="px-5 py-3 font-bold text-green-600">{formatRupiah(trx.total_amount)}</td>
                                                <td className="px-5 py-3 text-gray-500 text-xs">
                                                    {new Date(trx.created_at).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="text-center py-4 text-gray-400">Belum ada transaksi masuk.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}