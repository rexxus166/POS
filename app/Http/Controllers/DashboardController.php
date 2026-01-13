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
        $tenant = $user->tenant;

        // Cek apakah user Pro atau Trial
        $isPro = $tenant && $tenant->status === 'active';

        // 1. Hitung Omzet Hari Ini (Tersedia untuk Trial & Pro)
        $todayOmzet = Transaction::where('tenant_id', $tenantId)
            ->whereDate('created_at', Carbon::today())
            ->where('status', 'paid') // Pastikan status paid
            ->sum('total_amount');

        // 2. Hitung Total Transaksi Hari Ini (Tersedia untuk Trial & Pro)
        $todayCount = Transaction::where('tenant_id', $tenantId)
            ->whereDate('created_at', Carbon::today())
            ->where('status', 'paid')
            ->count();

        // 3. Ambil 5 Transaksi Terakhir - HANYA PRO
        $recentTransactions = [];
        if ($isPro) {
            $recentTransactions = Transaction::where('tenant_id', $tenantId)
                ->with('cashier') // Ambil nama kasir
                ->latest()
                ->take(5)
                ->get();
        }

        // 4. (Bonus) Produk Terlaris (Top 5) - HANYA PRO
        $topProducts = [];
        if ($isPro) {
            $topProducts = DB::table('transaction_details')
                ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
                ->join('products', 'transaction_details.product_id', '=', 'products.id')
                ->where('transactions.tenant_id', $tenantId)
                ->select('products.name', DB::raw('SUM(transaction_details.quantity) as total_sold'))
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get();
        }

        // 5. Info Subscription
        $tenant = $user->tenant;
        $subscriptionInfo = null;

        if ($tenant) {
            $endsAt = $tenant->subscription_ends_at;
            $daysLeft = $endsAt ? (int) now()->diffInDays($endsAt, false) : 0;

            // Tentukan Label Status & Tipe
            $statusLabel = 'Tidak Aktif';
            $statusColor = 'red';
            $typeLabel = 'Unknown';

            if ($tenant->status === 'trial') {
                $typeLabel = 'Trial (Uji Coba)';
                $statusLabel = $daysLeft > 0 ? 'Sedang Berjalan' : 'Sudah Berakhir';
                $statusColor = $daysLeft > 0 ? 'blue' : 'red';
            } elseif ($tenant->status === 'active') {
                $typeLabel = 'Pro Business';
                $statusLabel = 'Aktif';
                $statusColor = 'green';
            } elseif ($tenant->status === 'expired') {
                $typeLabel = 'Expired';
                $statusLabel = 'Non-Aktif';
                $statusColor = 'red';
            }

            $subscriptionInfo = [
                'type' => $typeLabel,
                'status_label' => $statusLabel,
                'status_color' => $statusColor,
                'days_remaining' => $daysLeft,
                // Asumsi start date untuk trial adalah created_at, untuk pro bisa disesuaikan nanti
                'start_date' => $tenant->created_at->translatedFormat('d F Y'),
                'end_date' => $endsAt ? $endsAt->translatedFormat('d F Y') : '-',
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'today_omzet' => $todayOmzet,
                'today_count' => $todayCount,
            ],
            'recent_transactions' => $recentTransactions,
            'top_products' => $topProducts,
            'subscription_info' => $subscriptionInfo
        ]);
    }
}
