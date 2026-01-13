import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function Dashboard({ auth, stats, recent_transactions, top_products }) {

    // Animation Variants
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Owner</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6"
                >

                    {/* --- KARTU STATISTIK --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Omzet Hari Ini */}
                        <motion.div variants={itemVariants} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                            <div className="text-gray-500 text-sm font-medium uppercase">Omzet Hari Ini</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">
                                {formatRupiah(stats.today_omzet)}
                            </div>
                        </motion.div>

                        {/* Card 2: Transaksi Hari Ini */}
                        <motion.div variants={itemVariants} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                            <div className="text-gray-500 text-sm font-medium uppercase">Transaksi Hari Ini</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">
                                {stats.today_count} <span className="text-sm text-gray-400 font-normal">struk</span>
                            </div>
                        </motion.div>

                        {/* Card 3: Shortcut ke Kasir */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-indigo-600 overflow-hidden shadow-sm sm:rounded-lg p-6 text-white flex flex-col justify-center items-center hover:bg-indigo-700 transition cursor-pointer"
                        >
                            <Link href={route('pos.index')} className="text-center w-full h-full flex flex-col items-center">
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                <span className="font-bold text-lg">Buka Mesin Kasir</span>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* --- TABEL TRANSAKSI TERAKHIR --- */}
                        <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Transaksi Terakhir</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2">Invoice</th>
                                            <th className="px-3 py-2">Kasir</th>
                                            <th className="px-3 py-2">Total</th>
                                            <th className="px-3 py-2">Metode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent_transactions.length > 0 ? (
                                            recent_transactions.map((trx) => (
                                                <tr key={trx.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-3 py-2 font-medium text-gray-900">{trx.invoice_code}</td>
                                                    <td className="px-3 py-2">{trx.cashier?.name}</td>
                                                    <td className="px-3 py-2 font-bold text-green-600">{formatRupiah(trx.total_amount)}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${trx.payment_method === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                            {trx.payment_method.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-gray-500">Belum ada transaksi hari ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* --- TOP PRODUK --- */}
                        <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Produk Terlaris</h3>
                            <ul className="space-y-3">
                                {top_products.length > 0 ? (
                                    top_products.map((prod, idx) => (
                                        <motion.li
                                            key={idx}
                                            whileHover={{ x: 5 }}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full text-xs mr-3">
                                                    #{idx + 1}
                                                </span>
                                                <span className="font-medium text-gray-700">{prod.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{prod.total_sold} <span className="text-xs font-normal text-gray-500">terjual</span></span>
                                        </motion.li>
                                    ))
                                ) : (
                                    <li className="text-center text-gray-500 py-4">Belum ada data penjualan.</li>
                                )}
                            </ul>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}