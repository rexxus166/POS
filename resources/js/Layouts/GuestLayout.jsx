import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-white">

            {/* --- BAGIAN KIRI (Branding & Visual) --- */}
            {/* Hidden di HP, Muncul di Layar Besar (lg) */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex lg:w-1/2 bg-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden"
            >
                {/* Background Pattern (Hiasan) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                {/* Logo & Brand */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-2xl tracking-tight">SobatNiaga</span>
                        <div className="bg-white text-indigo-900 p-2 rounded-lg font-bold text-xl">POS</div>
                    </Link>
                </div>

                {/* Content Tengah (Testimoni / Value Prop) */}
                <div className="relative z-10 max-w-md">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl font-extrabold leading-tight mb-6"
                    >
                        Kelola bisnis Anda dengan cara yang lebih cerdas.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-indigo-200 text-lg"
                    >
                        "Sejak pakai POS SaaS ini, omzet saya naik 30% karena stok gak pernah bocor lagi. Recommended banget!"
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-4 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">B</div>
                        <div>
                            <p className="font-bold text-sm">Budi Santoso</p>
                            <p className="text-indigo-300 text-xs">Owner Kopi Senja</p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Kecil */}
                <div className="relative z-10 text-indigo-300 text-sm">
                    &copy; {new Date().getFullYear()} SobatNiaga POS. Licensed by <span className="font-bold text-indigo-500">MiomiDev</span>.
                </div>
            </motion.div>

            {/* --- BAGIAN KANAN (Form) --- */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50"
            >
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    {/* Logo Mobile (Muncul cuma di HP) */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-bold text-xl text-gray-800">SobatNiaga</span>
                            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">POS</div>
                        </Link>
                    </div>

                    {children}
                </div>
            </motion.div>
        </div>
    );
}