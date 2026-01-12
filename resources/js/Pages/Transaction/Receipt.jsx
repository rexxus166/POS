import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Helper format rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Helper format tanggal
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function Receipt({ transaction }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Head title={`Struk ${transaction.invoice_code}`} />

            {/* KERTAS STRUK */}
            <div className="bg-white p-6 w-full max-w-sm shadow-2xl rounded-sm relative" style={{ fontFamily: "'Courier New', Courier, monospace" }}>

                {/* Efek Kertas Sobek di atas (Opsional visual candy) */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-white"></div>

                {/* Header Toko */}
                <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-widest">{transaction.tenant?.business_name || 'NAMA TOKO'}</h1>
                    <p className="text-xs text-gray-500 mt-1">{transaction.tenant?.address}</p>
                    <p className="text-xs text-gray-500">{transaction.tenant?.phone}</p>
                </div>

                {/* Info Transaksi */}
                <div className="text-xs mb-4 space-y-1">
                    <div className="flex justify-between">
                        <span>Invoice</span>
                        <span className="font-bold">{transaction.invoice_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Waktu</span>
                        <span>{formatDate(transaction.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Kasir</span>
                        <span>{transaction.cashier?.name}</span>
                    </div>
                </div>

                {/* List Belanjaan */}
                <div className="border-t-2 border-dashed border-gray-300 py-4 mb-4">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-left">
                                <th className="pb-2">Item</th>
                                <th className="pb-2 text-right">Qty</th>
                                <th className="pb-2 text-right">Harga</th>
                                <th className="pb-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.details.map((item, index) => (
                                <tr key={index} className="align-top">
                                    <td className="pb-1 pr-2">{item.product?.name}</td>
                                    <td className="pb-1 text-right">{item.quantity}</td>
                                    <td className="pb-1 text-right">{parseInt(item.price).toLocaleString('id-ID')}</td>
                                    <td className="pb-1 text-right font-bold">{formatRupiah(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Bayar */}
                <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                        <span>TOTAL</span>
                        <span>{formatRupiah(transaction.total_amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Bayar ({transaction.payment_method.toUpperCase()})</span>
                        <span>{formatRupiah(transaction.cash_amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Kembali</span>
                        <span>{formatRupiah(transaction.change_amount)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mb-6">
                    <p>Terima Kasih atas Kunjungan Anda</p>
                    <p>Barang yang dibeli tidak dapat ditukar</p>
                    <p className="mt-4 text-[10px]">Powered by SahabatNiaga</p>
                </div>

                {/* TOMBOL AKSI (Gak ikut ke-print kalau di setting print CSS) */}
                <div className="flex flex-col gap-2 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full bg-gray-800 text-white py-2 rounded font-bold text-sm hover:bg-black transition"
                    >
                        🖨️ Cetak / Simpan PDF
                    </button>

                    {/* Tombol Share WA (Opsional) */}
                    <a
                        href={`https://wa.me/?text=Struk Belanja ${transaction.invoice_code} Total ${formatRupiah(transaction.total_amount)} di ${transaction.tenant?.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-600 text-white py-2 rounded font-bold text-sm hover:bg-green-700 text-center"
                    >
                        📱 Kirim WhatsApp
                    </a>

                    <Link
                        href={route('pos.index')}
                        className="w-full bg-indigo-100 text-indigo-700 py-2 rounded font-bold text-sm hover:bg-indigo-200 text-center"
                    >
                        ⬅️ Kembali ke Kasir
                    </Link>
                </div>
            </div>

            {/* CSS KHUSUS PRINT: Sembunyikan tombol saat window.print() */}
            <style>{`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }
                    body {
                        background-color: white;
                    }
                    .min-h-screen {
                        height: auto;
                        padding: 0;
                    }
                    .shadow-2xl {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}