import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Suspended() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Head title="Akses Dibekukan" />

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-red-500">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Toko Ditangguhkan</h1>
                <p className="text-gray-600 mb-6">
                    Maaf, akses ke toko ini telah <b>dibekukan sementara</b> oleh Administrator.
                    Hal ini mungkin dikarenakan masalah pembayaran atau pelanggaran kebijakan.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg text-sm text-left mb-6">
                    <p className="font-bold text-gray-700">Apa yang harus dilakukan?</p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Hubungi tim support kami.</li>
                        <li>Selesaikan tagihan yang tertunggak.</li>
                        <li>Cek email Anda untuk detail lebih lanjut.</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <a href="https://wa.me/6283195937644" className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
                        Hubungi WhatsApp Admin
                    </a>

                    <Link href="/logout" method="post" as="button" className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
                        Keluar / Logout
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-sm">Powered by TemanNiaga &copy; {new Date().getFullYear()}</p>
        </div>
    );
}