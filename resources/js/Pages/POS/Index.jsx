import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import { Head, router } from '@inertiajs/react'; // Gunakan router untuk post manual
import Swal from 'sweetalert2'; // Opsional: Install sweetalert2 biar popup alert-nya bagus (npm install sweetalert2)

// Helper untuk format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function PosIndex({ products, store, auth }) {
    // --- STATE MANAGEMENT ---
    const [cart, setCart] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null); // 'cash' or 'qris'
    const [cashAmount, setCashAmount] = useState(''); // Uang Tunai dari Customer
    const [processing, setProcessing] = useState(false);
    const [qrisContent, setQrisContent] = useState(null); // Untuk menampung string QRIS
    const [isLoadingQris, setIsLoadingQris] = useState(false); // Loading state for QRIS

    // --- LOGIC KERANJANG (CART) ---

    // 1. Tambah ke Keranjang
    const addToCart = (product) => {
        // Cek stok dulu
        if (product.is_stock_managed && product.stock <= 0) {
            Swal.fire('Stok Habis', 'Produk ini sedang kosong.', 'error');
            return;
        }

        const existItem = cart.find((x) => x.id === product.id);

        if (existItem) {
            // Cek stok lagi sebelum nambah qty
            if (product.is_stock_managed && existItem.qty >= product.stock) {
                Swal.fire('Stok Terbatas', 'Jumlah melebihi stok tersedia.', 'warning');
                return;
            }

            setCart(
                cart.map((x) =>
                    x.id === product.id ? { ...existItem, qty: existItem.qty + 1 } : x
                )
            );
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    // 2. Kurangi Qty
    const decreaseQty = (product) => {
        const existItem = cart.find((x) => x.id === product.id);
        if (existItem.qty === 1) {
            // Hapus jika sisa 1
            setCart(cart.filter((x) => x.id !== product.id));
        } else {
            setCart(
                cart.map((x) =>
                    x.id === product.id ? { ...existItem, qty: existItem.qty - 1 } : x
                )
            );
        }
    };

    // 3. Hapus Item
    const removeFromCart = (productId) => {
        setCart(cart.filter((x) => x.id !== productId));
    };

    // 4. Hitung Total Belanja
    const grandTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);

    // --- LOGIC SEARCHING ---
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.sku?.toLowerCase().includes(keyword.toLowerCase())
    );

    // --- LOGIC PEMBAYARAN (CHECKOUT) ---

    // 1. Buka Modal Pembayaran
    const handleOpenPayment = (method) => {
        if (cart.length === 0) {
            Swal.fire('Keranjang Kosong', 'Pilih produk dulu sebelum bayar.', 'warning');
            return;
        }
        setPaymentMethod(method);
        setIsPaymentModalOpen(true);

        if (method === 'cash') {
            setCashAmount('');
        }

        // GENERATE DYNAMIC QRIS (Call Backend)
        if (method === 'qris') {
            setIsLoadingQris(true);
            setQrisContent(null);

            axios.post('/transaction/qris', {
                amount: grandTotal
            })
                .then(res => {
                    setQrisContent(res.data.qris_image);
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire('Error', 'Gagal generate QRIS Dinamis. Pastikan Raw String sudah disetting.', 'error');
                })
                .finally(() => setIsLoadingQris(false));
        }
    };

    // 2. Submit Transaksi ke Backend
    const processTransaction = () => {
        if (paymentMethod === 'cash') {
            if (parseInt(cashAmount) < grandTotal) {
                Swal.fire('Uang Kurang', 'Nominal uang tunai kurang dari total belanja.', 'error');
                return;
            }
        }

        setProcessing(true);

        // Kirim data ke TransactionController@store
        router.post(route('transaction.store'), {
            cart: cart,
            total_amount: grandTotal,
            payment_method: paymentMethod,
            cash_amount: paymentMethod === 'cash' ? parseInt(cashAmount) : 0,
        }, {
            onSuccess: () => {
                // Backend akan redirect ke Receipt Page otomatis
                // Kita cuma perlu bersih-bersih state lokal aja biar pas (kalau user back)
                setProcessing(false);
                setIsPaymentModalOpen(false);
                setCart([]);
                setPaymentMethod(null);
            },
            onError: (errors) => {
                setProcessing(false);
                console.error(errors);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan transaksi.', 'error');
            }
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            <Head title="Point of Sale" />

            {/* --- KOLOM KIRI: DAFTAR PRODUK --- */}
            <div className="w-2/3 flex flex-col border-r border-gray-200 bg-white">
                {/* Header Kiri */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{store?.name || 'POS System'}</h1>
                        <p className="text-sm text-gray-500">Kasir: {auth.user.name}</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            className="pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                {/* Grid Produk */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className={`bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100 overflow-hidden flex flex-col ${product.stock <= 0 && product.is_stock_managed ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                                >
                                    {/* Gambar Produk */}
                                    <div className="h-32 bg-gray-200 w-full relative">
                                        {product.image ? (
                                            <img src={`/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                        {/* Badge Stok */}
                                        {product.is_stock_managed && (
                                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                                Stok: {product.stock}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Produk */}
                                    <div className="p-3 flex flex-col flex-1 justify-between">
                                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                                        <p className="text-indigo-600 font-bold mt-1">{formatRupiah(product.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                            <p>Produk tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- KOLOM KANAN: KERANJANG & CHECKOUT --- */}
            <div className="w-1/3 flex flex-col bg-white shadow-xl z-20">
                {/* Header Keranjang */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Keranjang Pesanan
                    </h2>
                </div>

                {/* List Item Keranjang */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <p className="text-sm">Belum ada item yang dipilih</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{formatRupiah(item.price)} x {item.qty}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => decreaseQty(item)}
                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 font-bold"
                                    >-</button>
                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-7 h-7 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600 hover:bg-indigo-200 font-bold"
                                    >+</button>
                                </div>
                                <div className="text-right ml-4 min-w-[80px]">
                                    <p className="font-bold text-gray-800 text-sm">{formatRupiah(item.price * item.qty)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Total & Tombol Bayar */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
                    {/* Ringkasan */}
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatRupiah(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Pajak (0%)</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-dashed border-gray-300 mt-2">
                            <span>Total</span>
                            <span>{formatRupiah(grandTotal)}</span>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => setCart([])}
                            className="px-4 py-3 bg-red-100 text-red-600 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors"
                        >
                            Batal
                        </button>

                        {/* Tombol ini membuka Modal Pilihan Pembayaran */}
                        <div className="col-span-1 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleOpenPayment('cash')}
                                disabled={cart.length === 0}
                                className="px-2 py-3 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                Tunai
                            </button>
                            <button
                                onClick={() => handleOpenPayment('qris')}
                                disabled={cart.length === 0}
                                className="px-2 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                QRIS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL PEMBAYARAN --- */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">

                        {/* Header Modal */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {paymentMethod === 'cash' ? 'Pembayaran Tunai' : 'Pembayaran QRIS'}
                            </h3>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm mb-1">Total Tagihan</p>
                                <p className="text-3xl font-bold text-indigo-600">{formatRupiah(grandTotal)}</p>
                            </div>

                            {/* --- FORM CASH --- */}
                            {paymentMethod === 'cash' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Uang Diterima</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500 font-bold">Rp</span>
                                            <input
                                                type="number"
                                                autoFocus
                                                value={cashAmount}
                                                onChange={(e) => setCashAmount(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Kembalian Preview */}
                                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                        <span className="text-gray-600 font-medium">Kembalian</span>
                                        <span className={`font-bold text-lg ${parseInt(cashAmount) < grandTotal ? 'text-red-500' : 'text-green-600'}`}>
                                            {cashAmount ? formatRupiah(parseInt(cashAmount) - grandTotal) : 'Rp 0'}
                                        </span>
                                    </div>

                                    {/* Quick Money Buttons (Opsional) */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[20000, 50000, 100000].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setCashAmount(amt)}
                                                className="py-1 px-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-200"
                                            >
                                                {formatRupiah(amt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- FORM QRIS --- */}
                            {paymentMethod === 'qris' && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="bg-white p-2 border-2 border-dashed border-gray-300 rounded-xl relative">

                                        {isLoadingQris ? (
                                            <div className="w-48 h-48 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                                                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs text-gray-500">Generating QR...</span>
                                            </div>
                                        ) : qrisContent ? (
                                            <div
                                                className="w-48 h-48 [&>svg]:w-full [&>svg]:h-full" // Force SVG to fit
                                                dangerouslySetInnerHTML={{ __html: qrisContent }}
                                            />
                                        ) : (
                                            // Fallback kalau gagal generate
                                            <div className="w-48 h-48 bg-red-50 flex items-center justify-center text-center text-red-400 text-xs p-4">
                                                {store?.qris_static_image ? 'Gunakan QRIS Static (Fallback)' : 'QRIS Error'}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center text-sm text-gray-500">
                                        Scan QRIS di atas. <br />
                                        <span className="text-xs text-gray-400">Pastikan nama merchant sesuai: <b>{store?.name}</b></span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal Action */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-2">
                            <button
                                onClick={processTransaction}
                                disabled={processing || (paymentMethod === 'cash' && parseInt(cashAmount) < grandTotal)}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transform transition active:scale-95 flex justify-center items-center
                                    ${paymentMethod === 'cash'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    } ${processing || (paymentMethod === 'cash' && parseInt(cashAmount) < grandTotal) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    paymentMethod === 'cash' ? 'Bayar & Cetak Struk' : 'Simulasi Sukses Bayar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}