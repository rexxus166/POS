import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Expired() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head title="Masa Aktif Habis" />

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-orange-500">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Masa Aktif Habis</h1>
                <p className="text-gray-600 mb-6">
                    Masa percobaan (Trial) atau berlangganan toko Anda telah berakhir.
                    Semua fitur dibekukan sementara.
                </p>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-left mb-6">
                    <p className="font-bold text-indigo-900 mb-2">Upgrade ke Pro Business</p>
                    <ul className="text-sm text-indigo-800 space-y-1">
                        <li>✅ Akses penuh kembali</li>
                        <li>✅ Data aman tersimpan</li>
                        <li>✅ Laporan Keuangan Lengkap</li>
                    </ul>
                    <div className="mt-3 text-2xl font-extrabold text-indigo-700">
                        Rp 99.000 <span className="text-xs font-normal text-indigo-500">/ bulan</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <a href="https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20perpanjang%20langganan%20POS" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
                        Perpanjang Sekarang
                    </a>

                    <Link href="/logout" method="post" as="button" className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                        Keluar
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-sm">Powered by SahabatNiaga &copy; {new Date().getFullYear()}</p>
        </div>
    );
}
