import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';

export default function PosIndex({ products, tenant, cashierName }) {
    const [cart, setCart] = useState([]);
    const [keyword, setKeyword] = useState('');

    // --- STATE MODAL & QRIS ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [qrisSvg, setQrisSvg] = useState(null);
    const [isLoadingQris, setIsLoadingQris] = useState(false);

    // --- LOGIC KERANJANG BELANJA (State Lokal biar No Loading) ---

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQty = (productId, newQty) => {
        if (newQty < 1) return;
        setCart(cart.map(item =>
            item.id === productId ? { ...item, qty: newQty } : item
        ));
    };

    // Hitung Total
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = (subtotal * (tenant.settings?.tax_rate || 0)) / 100;
    const total = subtotal + tax;

    // Filter Produk
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // --- FUNCTION: HANDLE CHECKOUT (GENERATE QRIS) ---
    const handleCheckout = async () => {
        setShowPaymentModal(true);
        setIsLoadingQris(true);
        setQrisSvg(null);

        try {
            // Panggil API Backend kita
            const response = await axios.post('/transaction/qris', {
                amount: total // variable total dari perhitungan cart kamu
            });
            setQrisSvg(response.data.qris_image);
        } catch (error) {
            alert("Gagal generate QRIS: " + (error.response?.data?.error || "Error Server"));
            setShowPaymentModal(false);
        } finally {
            setIsLoadingQris(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            <Head title={`POS - ${tenant.business_name}`} />

            {/* --- BAGIAN KIRI: DAFTAR PRODUK --- */}
            <div className="w-2/3 flex flex-col h-full">
                {/* Header Kiri */}
                <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10">
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">{tenant.business_name}</h1>
                        <p className="text-xs text-gray-500">Kasir: {cashierName}</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* Grid Produk (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 gap-4 pb-20">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 border border-transparent hover:border-blue-400"
                            >
                                <div className="h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                                    {/* Placeholder Gambar */}
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="font-semibold text-gray-800 leading-tight">{product.name}</h3>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-blue-600 font-bold">{formatRupiah(product.price)}</p>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                        {product.is_stock_managed ? `Stok: ${product.stock}` : 'Jasa'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- BAGIAN KANAN: KERANJANG (CART) --- */}
            <div className="w-1/3 bg-white shadow-xl flex flex-col h-full border-l border-gray-200">
                {/* Header Cart */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-700">Keranjang Pesanan</h2>
                    <p className="text-xs text-gray-400">{cart.length} item ditambahkan</p>
                </div>

                {/* List Item Cart */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <p>Keranjang kosong</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="w-1/2">
                                    <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{formatRupiah(item.price)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-gray-600 hover:bg-gray-300">-</button>
                                    <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-gray-600 hover:bg-gray-300">+</button>
                                </div>
                                <div className="text-right pl-2">
                                    <p className="font-bold text-sm">{formatRupiah(item.price * item.qty)}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 mt-1">Hapus</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Total & Checkout */}
                <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>
                        {tenant.settings?.tax_rate > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Pajak ({tenant.settings.tax_rate}%)</span>
                                <span>{formatRupiah(tax)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-dashed border-gray-300">
                            <span>Total</span>
                            <span>{formatRupiah(total)}</span>
                        </div>
                    </div>

                    {/* Tombol Bayar */}
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 flex justify-center items-center space-x-2"
                    >
                        <span>Bayar Sekarang</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </button>

                    <div className="mt-3 text-center">
                        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">Kembali ke Dashboard</Link>
                    </div>
                </div>
            </div>
            {/* --- MODAL PAYMENT --- */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800">Pembayaran QRIS</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <p className="text-gray-500 text-sm">Scan QRIS di bawah untuk membayar</p>
                            <h2 className="text-2xl font-bold text-blue-600">{formatRupiah(total)}</h2>

                            {isLoadingQris ? (
                                <div className="h-64 w-64 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
                                    <span className="text-gray-400">Generating QR...</span>
                                </div>
                            ) : (
                                <div
                                    className="p-4 border-2 border-dashed border-blue-200 rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: qrisSvg }} // Render SVG dari server
                                />
                            )}

                            <p className="text-xs text-center text-gray-400">
                                QRIS ini otomatis ter-generate sesuai nominal transaksi.<br />
                                Checksum Validated.
                            </p>

                            <button
                                onClick={() => {
                                    alert('Ceritanya transaksi sukses!');
                                    setCart([]);
                                    setShowPaymentModal(false);
                                }}
                                className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 mt-4"
                            >
                                Simulasi Sukses Bayar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}