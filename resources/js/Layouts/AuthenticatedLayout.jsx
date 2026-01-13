import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingSidebar, setShowingSidebar] = useState(false);

    // Ambil URL saat ini untuk penanda menu "Active"
    // Ambil props global (subscription_alert) dari HandleInertiaRequests
    const { url, props } = usePage();
    const { subscription_alert } = props;

    // --- EFFECT: CEK SUBSCRIPTION ALERT ---
    useEffect(() => {
        // Cek apakah ada alert data
        if (subscription_alert) {
            Swal.fire({
                title: 'Masa Aktif Segera Habis!',
                text: `${subscription_alert.message || `Paket Anda akan berakhir dalam ${subscription_alert.days_left} hari lagi (${subscription_alert.date}).`}`,
                icon: 'warning',
                confirmButtonText: 'Perpanjang Sekarang',
                showCancelButton: true,
                cancelButtonText: 'Nanti Saja',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 mr-2',
                    cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-300'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Arahkan ke WA Admin atau Halaman Billing
                    window.location.href = "https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20perpanjang%20langganan";
                }
            });
        }
    }, [subscription_alert]);

    // --- DAFTAR MENU ---
    const menus = [
        // === MENU KHUSUS SUPER ADMIN (OWNER APLIKASI) ===
        {
            label: 'Admin Overview',
            route: 'super.dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            ),
            roles: ['owner'], // EKSKLUSIF OWNER
        },
        {
            label: 'Kelola Toko (Tenants)',
            route: 'super.tenants.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            ),
            roles: ['owner'], // EKSKLUSIF OWNER
        },

        // === MENU KHUSUS TENANT (ADMIN TOKO & KASIR) ===
        {
            label: 'Dashboard Toko',
            route: 'dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            ),
            roles: ['admin'], // HANYA ADMIN TOKO
        },
        {
            label: 'Mesin Kasir (POS)',
            route: 'pos.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            ),
            roles: ['admin', 'cashier'], // ADMIN & KASIR
        },
        {
            label: 'Menu & Produk',
            route: 'products.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            ),
            roles: ['admin'], // HANYA ADMIN TOKO
        },
        {
            label: 'Riwayat Transaksi',
            route: 'transaction.history',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ),
            roles: ['admin', 'cashier'], // ADMIN & KASIR
        },
        {
            label: 'Karyawan',
            route: 'employees.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ),
            roles: ['admin'], // HANYA ADMIN TOKO
        },
        {
            label: 'Pengaturan Toko',
            route: 'settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            ),
            roles: ['admin'], // HANYA ADMIN TOKO
        },
    ];

    // Filter menu berdasarkan role user yang sedang login
    const visibleMenus = menus.filter(menu => menu.roles.includes(user.role));

    // Animation Configs
    const sidebarVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const linkVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* --- SIDEBAR --- */}
            <motion.aside
                initial="hidden"
                animate="visible"
                variants={sidebarVariants}
                className={`bg-white w-64 min-h-screen border-r border-gray-200 fixed md:relative z-30 transition-all duration-300 ${showingSidebar ? 'ml-0' : '-ml-64 md:ml-0'}`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-lg tracking-tight">SobatNiaga</span>
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl"
                        >
                            POS
                        </motion.div>
                    </Link>
                </div>

                {/* User Info Kecil */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>

                {/* Menu Links */}
                <nav className="p-4 space-y-1 overflow-y-auto">
                    {visibleMenus.map((menu, index) => {
                        const isActive = route().current(menu.route + '*');
                        return (
                            <Link
                                key={index}
                                href={route(menu.route)}
                            >
                                <motion.div
                                    variants={linkVariants}
                                    whileHover={{ x: 5 }}
                                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-indigo-600' : 'text-gray-400'} mr-3`}>
                                        {menu.icon}
                                    </span>
                                    {menu.label}
                                </motion.div>
                            </Link>
                        )
                    })}

                    {/* Logout Link */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full"
                    >
                        <motion.div
                            variants={linkVariants}
                            whileHover={{ x: 5, color: '#991b1b' }}
                            className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Keluar / Logout
                        </motion.div>
                    </Link>
                </nav>
            </motion.aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">

                {/* Topbar Mobile (Hanya muncul di HP untuk buka sidebar) */}
                <header className="bg-white shadow-sm h-16 flex items-center px-4 md:hidden z-20 sticky top-0">
                    <button onClick={() => setShowingSidebar(!showingSidebar)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <span className="ml-4 font-bold text-gray-800">POS SaaS</span>
                </header>

                {/* Halaman Content dengan Transisi */}
                <motion.main
                    key={url} // Kunci ini memicu animasi ulang saat URL berubah
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"
                >
                    {/* Header Halaman (Breadcrumb) */}
                    {header && (
                        <div className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </div>
                    )}

                    {children}
                </motion.main>
            </div>

            {/* Overlay untuk Mobile */}
            {showingSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setShowingSidebar(false)}
                ></div>
            )}
        </div>
    );
}