import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="Aplikasi Kasir Online Terbaik" />

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl">POS</div>
                        <span className="self-center text-2xl font-bold whitespace-nowrap text-indigo-900">SaaS App</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition"
                            >
                                Dashboard Saya
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-4 py-2 text-center shadow-lg hover:shadow-indigo-500/50 transition"
                                >
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="bg-white pt-32 pb-20 px-4">
                <div className="max-w-screen-xl mx-auto text-center lg:py-16">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
                        Kelola Bisnis Kopi Anda <br />
                        <span className="text-indigo-600">Lebih Cerdas & Efisien</span>
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48">
                        Aplikasi Kasir (POS) berbasis Cloud yang dirancang khusus untuk UMKM F&B. Pantau omzet real-time, kelola stok otomatis, dan cetak struk tanpa ribet.
                    </p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 gap-4">
                        <Link
                            href={route('register')}
                            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow-xl transition transform hover:scale-105"
                        >
                            Mulai Trial 14 Hari
                            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 transition"
                        >
                            Pelajari Fitur
                        </a>
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="bg-gray-50 py-20">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900">Kenapa Memilih Kami?</h2>
                        <p className="text-gray-500 sm:text-xl mt-4">Semua fitur yang Anda butuhkan untuk mengembangkan bisnis.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">POS Cepat & Ringan</h3>
                            <p className="text-gray-500">Proses transaksi hitungan detik. Mendukung pembayaran Tunai & QRIS. Cetak struk bluetooth.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Laporan Real-time</h3>
                            <p className="text-gray-500">Pantau omzet harian, produk terlaris, dan kinerja kasir dari mana saja lewat HP Owner.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Manajemen Karyawan</h3>
                            <p className="text-gray-500">Buat akun khusus kasir dengan akses terbatas. Keamanan data terjamin.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section className="bg-white py-20">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Harga Transparan</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8 items-center">

                        {/* Free Tier */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm hover:border-indigo-300 transition">
                            <h3 className="text-xl font-semibold text-gray-500">Trial</h3>
                            <div className="my-4">
                                <span className="text-4xl font-extrabold text-gray-900">Gratis</span>
                                <span className="text-gray-500"> / 14 hari</span>
                            </div>
                            <ul className="text-left space-y-3 mb-8 text-gray-600">
                                <li>✅ Full Fitur POS</li>
                                <li>✅ 1 Toko / Cabang</li>
                                <li>✅ Unlimited Produk</li>
                                <li>✅ Laporan Dasar</li>
                            </ul>
                            <Link href={route('register')} className="block w-full py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
                                Daftar Sekarang
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-900 shadow-xl w-full max-w-sm transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                            <h3 className="text-xl font-semibold text-gray-300">Pro Business</h3>
                            <div className="my-4 text-white">
                                <span className="text-4xl font-extrabold">Rp 99rb</span>
                                <span className="text-gray-400"> / bulan</span>
                            </div>
                            <ul className="text-left space-y-3 mb-8 text-gray-300">
                                <li>🔥 Semua fitur Trial</li>
                                <li>🔥 Laporan Keuangan Lengkap</li>
                                <li>🔥 Manajemen Karyawan</li>
                                <li>🔥 Support Prioritas</li>
                            </ul>
                            <Link href={route('register')} className="block w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/50">
                                Pilih Paket Pro
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="bg-indigo-600 text-white p-1.5 rounded font-bold text-lg">POS</div>
                        <span className="font-bold text-gray-700">SaaS App</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        &copy; 2026 POS SaaS. Dibuat dengan Laravel & Inertia.
                    </div>
                </div>
            </footer>
        </div>
    );
}