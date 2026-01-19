import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingSidebar, setShowingSidebar] = useState(false); // Mobile overlay
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Load from localStorage for desktop/tablet
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved === 'true';
        }
        return false;
    });
    const [showingUserMenu, setShowingUserMenu] = useState(false);
    const [ping, setPing] = useState(null);
    const [isPortrait, setIsPortrait] = useState(false);

    // Ambil URL saat ini untuk penanda menu "Active"
    // Ambil props global (subscription_alert) dari HandleInertiaRequests
    const { url, props } = usePage();
    const { subscription_alert } = props;

    // --- EFFECT: DETECT PORTRAIT MODE ---
    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = window.innerWidth < 768;
            const isPortraitMode = window.innerHeight > window.innerWidth;
            setIsPortrait(isMobile && isPortraitMode);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    // --- EFFECT: MEASURE NETWORK PING ---
    useEffect(() => {
        const measurePing = async () => {
            const start = performance.now();
            try {
                await fetch('/api/ping', { method: 'HEAD' });
                const end = performance.now();
                setPing(Math.round(end - start));
            } catch (error) {
                setPing(null);
            }
        };

        measurePing();
        const interval = setInterval(measurePing, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, []);

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

    // --- EFFECT: SAVE SIDEBAR STATE TO LOCALSTORAGE ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
        }
    }, [sidebarCollapsed]);

    // Toggle sidebar collapse (for desktop/tablet)
    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

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
            label: '🧪 Bahan Mentah',
            route: 'raw-materials.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
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
            roles: ['admin'],
            isPremium: true, // PRO BUSINESS ONLY
        },
        {
            label: '📊 Laporan Laba Rugi',
            route: 'reports.profit-loss',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            ),
            roles: ['admin'],
            isPremium: true, // PRO BUSINESS ONLY
        },
        {
            label: '💰 Laporan Keuangan',
            route: 'reports.financial',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            ),
            roles: ['admin'],
            isPremium: true, // PRO BUSINESS ONLY
        },
        {
            label: '📋 Log Aktivitas',
            route: 'activity-logs.index',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            ),
            roles: ['admin'],
            isPremium: true, // PRO BUSINESS ONLY
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
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* === LANDSCAPE ORIENTATION REQUIRED OVERLAY === */}
            {isPortrait && (
                <div className="fixed inset-0 bg-gray-900 z-[9999] flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-white rounded-2xl p-8 max-w-sm shadow-2xl">
                        <div className="mb-6">
                            <svg className="w-20 h-20 mx-auto text-indigo-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rotate Your Device</h2>
                        <p className="text-gray-600 mb-6">
                            Aplikasi POS ini memerlukan mode <strong>Landscape</strong> untuk pengalaman terbaik.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold">
                            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Putar perangkat Anda
                        </div>
                    </div>
                </div>
            )}

            {/* --- SIDEBAR --- */}
            <motion.aside
                initial="hidden"
                animate="visible"
                variants={sidebarVariants}
                className={`bg-white h-full border-r border-gray-200 fixed md:relative z-30 transition-all duration-300 flex flex-col ${showingSidebar ? 'ml-0' : '-ml-64 md:ml-0'
                    } ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'
                    } w-64`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                    <Link href="/" className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'gap-2'}`}>
                        {!sidebarCollapsed ? (
                            <>
                                <span className="font-bold text-gray-800 text-lg tracking-tight">SobatNiaga</span>
                                <motion.div
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl"
                                >
                                    POS
                                </motion.div>
                            </>
                        ) : (
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl"
                            >
                                POS
                            </motion.div>
                        )}
                    </Link>
                </div>

                {/* Floating Toggle Button - Desktop/Tablet Only */}
                <motion.button
                    onClick={toggleSidebarCollapse}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex absolute top-20 -right-4 z-50 w-8 h-16 bg-white border border-gray-200 rounded-r-lg shadow-lg items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 group"
                    title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    <svg
                        className={`w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-all duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </motion.button>


                {/* User Info Kecil */}
                {!sidebarCollapsed && (
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                )}

                {/* Menu Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {visibleMenus.map((menu, index) => {
                        const isActive = route().current(menu.route + '*');
                        const isTrial = user.tenant?.status === 'trial';
                        const isLocked = menu.isPremium && isTrial;

                        return (
                            <Link
                                key={index}
                                href={route(menu.route)}
                                className={isLocked ? 'pointer-events-none' : ''}
                                title={sidebarCollapsed ? menu.label : ''}
                            >
                                <motion.div
                                    variants={linkVariants}
                                    whileHover={!isLocked ? { x: sidebarCollapsed ? 0 : 5 } : {}}
                                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isLocked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <div className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
                                        <span className={`${isActive ? 'text-indigo-600' : isLocked ? 'text-gray-300' : 'text-gray-400'}`}>
                                            {menu.icon}
                                        </span>
                                        {!sidebarCollapsed && menu.label}
                                    </div>
                                    {!sidebarCollapsed && isLocked && (
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
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
                        title={sidebarCollapsed ? 'Keluar / Logout' : ''}
                    >
                        <motion.div
                            variants={linkVariants}
                            whileHover={{ x: sidebarCollapsed ? 0 : 5, color: '#991b1b' }}
                            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4`}
                        >
                            <svg className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            {!sidebarCollapsed && 'Keluar / Logout'}
                        </motion.div>
                    </Link>
                </nav>
            </motion.aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col h-full transition-all duration-300">

                {/* Topbar Mobile (Hanya muncul di HP untuk buka sidebar) */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:hidden z-20 sticky top-0">
                    <div className="flex items-center">
                        <button onClick={() => setShowingSidebar(!showingSidebar)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <span className="ml-4 font-bold text-gray-800">POS SaaS</span>
                    </div>

                    {/* Status Indicators + User Dropdown */}
                    <div className="flex items-center gap-3">
                        {/* Subscription Badge */}
                        {user.tenant && (
                            <div className={`px-2 py-1 rounded-full text-xs font-bold ${user.tenant.status === 'trial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {user.tenant.status === 'trial' ? 'TRIAL' : 'PRO'}
                            </div>
                        )}

                        {/* Network Ping */}
                        {ping !== null && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <div className={`w-2 h-2 rounded-full ${ping < 100 ? 'bg-green-500' : ping < 300 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                <span className="hidden sm:inline">{ping}ms</span>
                            </div>
                        )}

                        {/* User Dropdown - Mobile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowingUserMenu(!showingUserMenu)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {showingUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowingUserMenu(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-40">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            👤 Profil
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            🚪 Keluar
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Halaman Content dengan Transisi */}
                <motion.main
                    key={url} // Kunci ini memicu animasi ulang saat URL berubah
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 scrollbar-hide"
                >
                    {/* Header Halaman (Breadcrumb) - STICKY */}
                    {header && (
                        <div className="bg-white shadow sticky top-0 z-40">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                <div>
                                    {header}
                                </div>

                                {/* Status Indicators - Desktop Only */}
                                <div className="hidden md:flex items-center gap-3">
                                    {/* Subscription Badge */}
                                    {user.tenant && (
                                        <div className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${user.tenant.status === 'trial'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {user.tenant.status === 'trial' ? (
                                                <>
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                                    </svg>
                                                    TRIAL
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                    PRO BUSINESS
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Network Ping */}
                                    {ping !== null && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${ping < 100 ? 'bg-green-500' : ping < 300 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                            <span className="text-gray-700 font-medium">{ping}ms</span>
                                            <span className="text-gray-400 text-xs">
                                                {ping < 100 ? 'Excellent' : ping < 300 ? 'Good' : 'Slow'}
                                            </span>
                                        </div>
                                    )}
                                </div>
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