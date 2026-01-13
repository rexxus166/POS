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

export default function Dashboard({ auth, stats, recent_transactions, top_products, subscription_info }) {

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
                    {/* --- INFO SUBSCRIPTION --- */}
                    {subscription_info && (
                        <motion.div
                            variants={itemVariants}
                            className={`p-6 rounded-2xl shadow-lg text-white relative overflow-hidden ${subscription_info.status_color === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                                subscription_info.status_color === 'green' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                                    'bg-gradient-to-r from-blue-600 to-indigo-700'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold opacity-90 mb-1">Status Langganan</h3>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-bold">{subscription_info.type}</h2>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                            {subscription_info.status_label}
                                        </span>
                                    </div>
                                    <p className="mt-2 opacity-90 text-sm">
                                        Aktif sejak <span className="font-bold">{subscription_info.start_date}</span> sampai <span className="font-bold">{subscription_info.end_date}</span>
                                    </p>
                                </div>

                                <div className="text-center md:text-right">
                                    <div className="text-sm opacity-80 uppercase font-bold tracking-widest">Sisa Waktu</div>
                                    <div className="text-4xl font-extrabold flex items-baseline justify-center md:justify-end gap-1">
                                        {subscription_info.days_remaining} <span className="text-lg font-medium">Hari</span>
                                    </div>

                                    {subscription_info.days_remaining <= 5 && (
                                        <a
                                            href="https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20perpanjang%20langganan%20POS"
                                            target="_blank"
                                            className="mt-3 inline-block bg-white text-indigo-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-lg"
                                        >
                                            🚀 Perpanjang Sekarang
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        </motion.div>
                    )}

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

                            {recent_transactions.length > 0 ? (
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
                                            {recent_transactions.map((trx) => (
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // [BARU] Tampilkan Upgrade CTA untuk Trial Users
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Fitur Pro Business</h4>
                                    <p className="text-gray-500 text-sm mb-4">Lihat riwayat transaksi lengkap dengan upgrade ke Pro</p>
                                    <a href="https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20upgrade%20ke%20Pro%20Business" target="_blank" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition">
                                        🚀 Upgrade Sekarang
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        {/* --- TOP PRODUK --- */}
                        <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Produk Terlaris</h3>

                            {top_products.length > 0 ? (
                                <ul className="space-y-3">
                                    {top_products.map((prod, idx) => (
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
                                    ))}
                                </ul>
                            ) : (
                                // [BARU] Tampilkan Upgrade CTA untuk Trial Users
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Fitur Pro Business</h4>
                                    <p className="text-gray-500 text-sm mb-4">Analisa produk terlaris untuk strategi bisnis lebih baik</p>
                                    <a href="https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20upgrade%20ke%20Pro%20Business" target="_blank" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition">
                                        🚀 Upgrade Sekarang
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}