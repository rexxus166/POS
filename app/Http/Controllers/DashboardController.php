<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Product;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id; // Asumsi user sudah punya tenant_id

        // 1. Hitung Omzet Hari Ini
        $todayOmzet = Transaction::where('tenant_id', $tenantId)
            ->whereDate('created_at', Carbon::today())
            ->where('status', 'paid') // Pastikan status paid
            ->sum('total_amount');

        // 2. Hitung Total Transaksi Hari Ini
        $todayCount = Transaction::where('tenant_id', $tenantId)
            ->whereDate('created_at', Carbon::today())
            ->where('status', 'paid')
            ->count();

        // 3. Ambil 5 Transaksi Terakhir
        $recentTransactions = Transaction::where('tenant_id', $tenantId)
            ->with('cashier') // Ambil nama kasir
            ->latest()
            ->take(5)
            ->get();

        // 4. (Bonus) Produk Terlaris (Top 5)
        // Ini query agak complex dikit pakai join
        $topProducts = DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $tenantId)
            ->select('products.name', DB::raw('SUM(transaction_details.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'today_omzet' => $todayOmzet,
                'today_count' => $todayCount,
            ],
            'recent_transactions' => $recentTransactions,
            'top_products' => $topProducts
        ]);
    }
}
