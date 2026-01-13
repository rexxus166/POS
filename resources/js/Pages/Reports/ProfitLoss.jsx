import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function ProfitLoss({ auth, summary, daily_revenue, top_products, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get(route('reports.profit-loss'), {
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">📊 Laporan Laba Rugi</h2>}
        >
            <Head title="Laporan Laba Rugi" />

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
                            <div className="flex gap-2">
                                <a
                                    href={route('reports.profit-loss.export-excel', { start_date: startDate, end_date: endDate })}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition text-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Excel
                                </a>
                                <a
                                    href={route('reports.profit-loss.export-pdf', { start_date: startDate, end_date: endDate })}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition text-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    PDF
                                </a>
                            </div>
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

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Pendapatan */}
                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium opacity-90">Total Pendapatan</h4>
                                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="text-3xl font-extrabold">{formatRupiah(summary.total_revenue)}</div>
                            <div className="text-xs mt-2 opacity-80">{summary.total_transactions} transaksi</div>
                        </motion.div>

                        {/* HPP (COGS) */}
                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium opacity-90">HPP (Modal)</h4>
                                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            </div>
                            <div className="text-3xl font-extrabold">{formatRupiah(summary.cogs)}</div>
                            <div className="text-xs mt-2 opacity-80">Harga Pokok Penjualan</div>
                        </motion.div>

                        {/* Laba Kotor */}
                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium opacity-90">Laba Kotor</h4>
                                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <div className="text-3xl font-extrabold">{formatRupiah(summary.gross_profit)}</div>
                            <div className="text-xs mt-2 opacity-80">Pendapatan - HPP</div>
                        </motion.div>

                        {/* Margin */}
                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium opacity-90">Margin Laba</h4>
                                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <div className="text-3xl font-extrabold">{summary.gross_profit_margin}%</div>
                            <div className="text-xs mt-2 opacity-80">Gross Profit Margin</div>
                        </motion.div>
                    </div>

                    {/* Top Products by Profit */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🏆 Top 10 Produk Berdasarkan Profit</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Nama Produk</th>
                                        <th className="px-4 py-3">Terjual</th>
                                        <th className="px-4 py-3">Pendapatan</th>
                                        <th className="px-4 py-3">HPP</th>
                                        <th className="px-4 py-3">Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_products.length > 0 ? (
                                        top_products.map((product, idx) => (
                                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full text-xs">
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                                <td className="px-4 py-3">{product.total_sold} pcs</td>
                                                <td className="px-4 py-3 text-green-600 font-bold">{formatRupiah(product.revenue)}</td>
                                                <td className="px-4 py-3 text-red-600">{formatRupiah(product.cogs)}</td>
                                                <td className="px-4 py-3 text-blue-600 font-bold">{formatRupiah(product.profit)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada data penjualan pada periode ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Daily Revenue Chart */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">📈 Trend Pendapatan Harian</h3>
                        {daily_revenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={daily_revenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    />
                                    <YAxis tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(value) => formatRupiah(value)}
                                        labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} name="Pendapatan" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-500">Belum ada data.</div>
                        )}
                    </motion.div>

                    {/* Top Products Chart */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🏆 Visualisasi Top Produk by Profit</h3>
                        {top_products.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={top_products.slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Legend />
                                    <Bar dataKey="profit" fill="#4F46E5" name="Profit" />
                                    <Bar dataKey="revenue" fill="#10B981" name="Pendapatan" />
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
