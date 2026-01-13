import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function Financial({ auth, payment_methods, cashier_performance, total_revenue, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    const handleFilter = () => {
        router.get(route('reports.financial'), {
            start_date: startDate,
            end_date: endDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">💰 Laporan Keuangan Detail</h2>}
        >
            <Head title="Laporan Keuangan" />

            <div className="py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6"
                >
                    {/* Filter Tanggal */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Filter Periode</h3>
                            <a
                                href={route('reports.financial.export-excel', { start_date: startDate, end_date: endDate })}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Export Excel
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </motion.div>

                    {/* Total Revenue Card */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium opacity-90 mb-2">Total Pendapatan</h3>
                                <div className="text-4xl font-extrabold">{formatRupiah(total_revenue)}</div>
                                <p className="text-sm opacity-80 mt-2">Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}</p>
                            </div>
                            <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Methods Breakdown */}
                        <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">💳 Metode Pembayaran</h3>
                            <div className="space-y-4">
                                {payment_methods.length > 0 ? (
                                    payment_methods.map((method, idx) => {
                                        const percentage = total_revenue > 0 ? (method.total / total_revenue * 100).toFixed(1) : 0;
                                        return (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method.payment_method === 'cash' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {method.payment_method === 'cash' ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 uppercase">{method.payment_method}</div>
                                                            <div className="text-xs text-gray-500">{method.count} transaksi</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">{formatRupiah(method.total)}</div>
                                                        <div className="text-xs text-gray-500">{percentage}%</div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div className={`h-2 rounded-full ${method.payment_method === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Belum ada data transaksi.</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Cashier Performance */}
                        <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">👥 Performa Kasir</h3>
                            <div className="space-y-4">
                                {cashier_performance.length > 0 ? (
                                    cashier_performance.map((cashier, idx) => {
                                        const percentage = total_revenue > 0 ? (cashier.total / total_revenue * 100).toFixed(1) : 0;
                                        return (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                                            {cashier.cashier?.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{cashier.cashier?.name || 'Unknown'}</div>
                                                            <div className="text-xs text-gray-500">{cashier.count} transaksi</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">{formatRupiah(cashier.total)}</div>
                                                        <div className="text-xs text-gray-500">{percentage}%</div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Belum ada data transaksi.</div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Payment Methods Chart */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">💳 Distribusi Metode Pembayaran</h3>
                        {payment_methods.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={payment_methods}
                                        dataKey="total"
                                        nameKey="payment_method"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry) => `${entry.payment_method.toUpperCase()}: ${((entry.total / total_revenue) * 100).toFixed(1)}%`}
                                    >
                                        {payment_methods.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-500">Belum ada data.</div>
                        )}
                    </motion.div>

                    {/* Cashier Performance Chart */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">👥 Performa Kasir</h3>
                        {cashier_performance.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={cashier_performance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="cashier.name" />
                                    <YAxis tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Legend />
                                    <Bar dataKey="total" fill="#4F46E5" name="Total Penjualan" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-500">Belum ada data.</div>
                        )}
                    </motion.div>

                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
