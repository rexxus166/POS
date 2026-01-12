<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Product;
use App\Models\Tenant;
use App\Helpers\QrisLogic;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function generateQris(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100', // Minimal Rp 100 perak
        ]);

        $user = Auth::user();
        $tenant = $user->tenant;

        if (!$tenant || !$tenant->qris_raw_string) {
            return response()->json(['error' => 'Toko ini belum upload QRIS Statis!'], 400);
        }

        // 1. Ambil String Mentah dari Database
        $rawQris = $tenant->qris_raw_string;

        // 2. Manipulasi jadi Dinamis pakai Helper kita
        $dynamicQrisString = QrisLogic::injectAmount($rawQris, $request->amount);

        // 3. Render jadi SVG (Ringan & Tajam)
        $qrImage = QrCode::size(300)->generate($dynamicQrisString);

        // Kirim balik SVG-nya ke React
        return response()->json([
            'qris_string' => $dynamicQrisString, // Buat debugging
            'qris_image' => (string) $qrImage
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Data dari Frontend
        $request->validate([
            'cart' => 'required|array', // Array belanjaan
            'cart.*.id' => 'required|exists:products,id',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|in:cash,qris',
            'cash_amount' => 'nullable|numeric', // Wajib jika cash
        ]);

        $user = Auth::user();

        // GUNAKAN DB TRANSACTION (Biar kalau error di tengah, data gak masuk setengah-setengah)
        try {
            DB::beginTransaction();

            // 2. Buat Kode Invoice Unik (INV-TIMESTAMP-RANDOM)
            $invoiceCode = 'INV-' . time() . '-' . rand(100, 999);

            // 3. Simpan Header Transaksi
            $transaction = Transaction::create([
                'tenant_id' => $user->tenant_id,
                'user_id' => $user->id,
                'invoice_code' => $invoiceCode,
                'total_amount' => $request->total_amount,
                'cash_amount' => $request->payment_method == 'cash' ? $request->cash_amount : $request->total_amount,
                'change_amount' => $request->payment_method == 'cash' ? ($request->cash_amount - $request->total_amount) : 0,
                'payment_method' => $request->payment_method,
                'status' => 'paid', // Asumsi kasir langsung sukses
            ]);

            // 4. Simpan Detail Item & KURANGI STOK
            foreach ($request->cart as $item) {
                // Simpan ke transaction_details
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['qty'], // Pastikan di React namanya 'qty' atau sesuaikan
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['qty'],
                ]);

                // Logic Kurangi Stok (Jika Managed)
                $product = Product::find($item['id']);
                if ($product->is_stock_managed) {
                    $product->decrement('stock', $item['qty']);
                }
            }

            DB::commit();

            // Balikin response sukses -> Redirect ke Halaman Struk
            return redirect()->route('transaction.receipt', ['invoice_code' => $invoiceCode]);
        } catch (\Exception $e) {
            DB::rollback();
            // Kalau error, balikin ke POS dengan pesan error
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // Method untuk menampilkan Struk
    public function show($invoiceCode)
    {
        $user = Auth::user();

        // Cari transaksi berdasarkan Invoice Code & Pastikan milik toko user yang login (biar aman)
        $transaction = Transaction::with(['details.product', 'cashier', 'tenant'])
            ->where('invoice_code', $invoiceCode)
            ->where('tenant_id', $user->tenant_id)
            ->firstOrFail();

        return Inertia::render('Transaction/Receipt', [
            'transaction' => $transaction
        ]);
    }

    // [BARU] Method untuk Halaman Riwayat Transaksi
    public function history(Request $request)
    {
        $user = Auth::user();

        // Ambil parameter tanggal dari request (kalau ada)
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Query Dasar: Ambil transaksi milik tenant ini
        $query = Transaction::with(['cashier']) // Eager load data kasir
            ->where('tenant_id', $user->tenant_id)
            ->latest(); // Urutkan dari yang terbaru

        // Filter Berdasarkan Tanggal (Jika user memilih tanggal)
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        }

        // Ambil data dengan Pagination (10 per halaman)
        // append(request()->query()) berguna agar saat ganti halaman, filter tanggal tidak hilang
        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Transaction/History', [
            'transactions' => $transactions,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }
}
