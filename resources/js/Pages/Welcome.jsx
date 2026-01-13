import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
            <Head title="Aplikasi Kasir Online Terbaik - SobatNiaga" />

            {/* --- BACKGROUND DECORATION --- */}
            <div className="absolute top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-white">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* --- NAVBAR --- */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed w-full z-50 top-0 start-0 border-b border-white/20 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
            >
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
                    <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </motion.div>
                        <span className="self-center text-2xl font-extrabold whitespace-nowrap text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">SobatNiaga</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-full text-sm px-6 py-2.5 text-center shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Dashboard Saya
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-900 hover:text-indigo-600 font-medium rounded-full text-sm px-4 py-2.5 text-center transition-colors hidden sm:block"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-full text-sm px-6 py-2.5 text-center shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-20 px-4 relative">
                <div className="max-w-screen-xl mx-auto text-center lg:py-20 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 tracking-wide uppercase border border-indigo-200">
                            Solusi KASIR NO #1 UNTUK UMKM
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="mb-6 text-5xl font-extrabold tracking-tight leading-none text-gray-900 md:text-6xl lg:text-7xl">
                            Bisnis Jadi Mudah, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Omzet Makin Melimpah</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 max-w-4xl mx-auto leading-relaxed">
                            Aplikasi Kasir (POS) berbasis Cloud yang dirancang khusus untuk mempercepat operasional bisnismu. Pantau stok, laporan keuangan, dan kinerja karyawan dari mana saja.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 gap-4">
                            <Link
                                href={route('register')}
                                className="inline-flex justify-center items-center py-4 px-8 text-base font-bold text-center text-white rounded-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow-xl shadow-indigo-500/40 transition-all transform hover:scale-105"
                            >
                                Mulai Trial 14 Hari
                                <svg className="w-5 h-5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex justify-center items-center py-4 px-8 text-base font-bold text-center text-gray-900 rounded-full border border-gray-300 hover:bg-white hover:shadow-lg focus:ring-4 focus:ring-gray-100 transition-all bg-white/50 backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Tonton Demo
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Mockup Floating */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mt-16 relative mx-auto max-w-5xl"
                    >
                        <div className="bg-gray-900 rounded-2xl shadow-2xl p-2 sm:p-4 ring-1 ring-gray-900/10">
                            <div className="rounded-xl overflow-hidden bg-white aspect-[16/9] relative group">
                                {/* Abstract UI Placeholder for Demo */}
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🖥️ 📱</div>
                                        <p className="text-gray-400 font-medium">Interactive Dashboard Preview</p>
                                    </div>
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blobs behind UI */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    </motion.div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="py-24 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white"></div>

                <div className="max-w-screen-xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Kenapa SobatNiaga?</motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-500 sm:text-xl mt-4 max-w-2xl mx-auto">
                            Kami memberikan semua alat yang dibutuhkan bisnis modern untuk tumbuh cepat dan efisien.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 - Updated */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Transaksi Secepat Kilat</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Proses pesanan pelanggan dalam hitungan detik. UI intuitif yang mudah digunakan kasir baru sekalipun. Dukung QRIS & Tunai.
                            </p>
                        </motion.div>

                        {/* Feature 2 - Updated with Charts */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Laporan Laba Rugi Lengkap</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Analisa profit real-time dengan grafik interaktif. Pantau HPP, margin, top produk, dan trend penjualan. Export ke Excel/PDF!
                            </p>
                        </motion.div>

                        {/* Feature 3 - Updated with Activity Log */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.4 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Log Aktivitas Karyawan</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Tracking lengkap setiap aktivitas kasir. Cegah kecurangan dengan log login, transaksi, dan perubahan data yang transparan.
                            </p>
                        </motion.div>

                        {/* NEW Feature 4 - Export & Charts */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.6 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Export PDF & Excel</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Download laporan keuangan dalam format PDF atau Excel. Siap untuk presentasi, audit, atau arsip bisnis Anda.
                            </p>
                        </motion.div>

                        {/* NEW Feature 5 - Visual Charts */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.8 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Grafik Visual Interaktif</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Visualisasi data dengan Line Chart, Bar Chart, dan Pie Chart. Lihat trend penjualan dan performa bisnis dengan jelas!
                            </p>
                        </motion.div>

                        {/* NEW Feature 6 - Email Notifications */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 1.0 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Notifikasi Email Otomatis</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Reminder otomatis sebelum subscription habis. Jangan sampai bisnis terganggu karena lupa perpanjang paket!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Investasi Cerdas untuk Bisnis</h2>
                        <p className="text-gray-500 text-lg">Pilih paket yang sesuai dengan skala bisnismu saat ini.</p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-center gap-8 items-center max-w-5xl mx-auto">

                        {/* Free Tier */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm w-full max-w-sm hover:border-indigo-300 transition-all duration-300"
                        >
                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">Starter Trial</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold text-gray-900">Rp 0</span>
                                <span className="text-gray-500 font-medium"> / 14 hari</span>
                            </div>
                            <ul className="text-left space-y-4 mb-10 text-gray-600">
                                <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Full Akses Fitur POS</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 1 Toko / Cabang</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited Produk</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Laporan Keuangan Detail</li>
                            </ul>
                            <Link href={route('register')} className="block w-full py-4 px-6 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                Mulai Gratis
                            </Link>
                        </motion.div>

                        {/* Pro Tier */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-2xl w-full max-w-sm relative overflow-hidden transform md:-translate-y-6"
                        >
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">BEST CHOICE</div>

                            <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-widest mb-4">Pro Business</h3>
                            <div className="mb-6 text-white">
                                <span className="text-5xl font-extrabold">99rb</span>
                                <span className="text-gray-400 font-medium"> / bulan</span>
                            </div>
                            <ul className="text-left space-y-4 mb-10 text-gray-300">
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Semua Fitur Trial</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Laporan Laba Rugi + HPP</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Export PDF & Excel</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Grafik Visual Interaktif</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Log Aktivitas Karyawan</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Email Reminder Otomatis</li>
                                <li className="flex items-center"><svg className="w-5 h-5 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Support Prioritas WhatsApp</li>
                            </ul>
                            <Link href={route('register')} className="block w-full py-4 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70">
                                Pilih Paket Pro
                            </Link>

                            {/* Glow Effect */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-20 bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                        Siap Mengubah Cara Anda Berbisnis?
                    </h2>
                    <p className="text-indigo-200 text-xl mb-10">
                        Bergabunglah dengan ribuan UMKM lain yang telah beralih ke SobatNiaga. Coba gratis, tanpa kartu kredit.
                    </p>
                    <Link
                        href={route('register')}
                        className="inline-block py-4 px-10 text-lg font-bold text-indigo-900 bg-white rounded-full hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
                    >
                        Daftar Sekarang Gratis
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between mb-12">
                        <div className="mb-8 md:mb-0">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="font-bold text-gray-900 text-2xl tracking-tight">SobatNiaga</span>
                                <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl">POS</div>
                            </div>
                            <p className="text-gray-500 max-w-sm">
                                Partner digital terbaik untuk pertumbuhan bisnis F&B dan Retail Anda. Simpel, Cepat, Terjangkau.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-16">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Produk</h4>
                                <ul className="space-y-3 text-gray-500">
                                    <li><a href="#" className="hover:text-indigo-600">Fitur</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Harga</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Hardware</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Dukungan</h4>
                                <ul className="space-y-3 text-gray-500">
                                    <li><a href="#" className="hover:text-indigo-600">Bantuan</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Hubungi Kami</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Panduan</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} SobatNiaga POS. Licensed by <span className="font-bold text-indigo-500">MiomiDev</span>.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-indigo-600">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.27 0-4.192 1.543-4.192 4.615v3.385z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.251-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.069-4.849 0-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 6.557c-3.31 0-6 2.682-6 5.993 0 3.31 2.69 6 6 6 3.31 0 6-2.69 6-6 0-3.311-2.69-5.993-6-5.993zm0 10.163c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}