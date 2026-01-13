<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Product;
use App\Exports\ProfitLossExport;
use App\Exports\FinancialReportExport;
use Carbon\Carbon;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * Laporan Laba Rugi (Profit & Loss Statement)
     * Fitur ini HANYA untuk Pro Business
     */
    public function profitLoss(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Ambil parameter tanggal dari request (default: bulan ini)
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        // 1. PENDAPATAN (Revenue)
        $totalRevenue = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum('total_amount');

        // 2. HARGA POKOK PENJUALAN (COGS - Cost of Goods Sold)
        // Hitung total HPP dari produk yang terjual
        $cogs = DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $tenantId)
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum(DB::raw('transaction_details.quantity * products.cost_price'));

        // 3. LABA KOTOR (Gross Profit)
        $grossProfit = $totalRevenue - $cogs;

        // 4. MARGIN LABA KOTOR (Gross Profit Margin %)
        $grossProfitMargin = $totalRevenue > 0 ? ($grossProfit / $totalRevenue) * 100 : 0;

        // 5. TOTAL TRANSAKSI
        $totalTransactions = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->count();

        // 6. RATA-RATA NILAI TRANSAKSI
        $averageTransaction = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;

        // 7. BREAKDOWN PENDAPATAN PER HARI (untuk chart)
        $dailyRevenue = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 8. TOP 10 PRODUK BERDASARKAN PROFIT
        $topProductsByProfit = DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $tenantId)
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_details.quantity) as total_sold'),
                DB::raw('SUM(transaction_details.subtotal) as revenue'),
                DB::raw('SUM(transaction_details.quantity * products.cost_price) as cogs'),
                DB::raw('SUM(transaction_details.subtotal - (transaction_details.quantity * products.cost_price)) as profit')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('profit')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/ProfitLoss', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'cogs' => $cogs,
                'gross_profit' => $grossProfit,
                'gross_profit_margin' => round($grossProfitMargin, 2),
                'total_transactions' => $totalTransactions,
                'average_transaction' => $averageTransaction,
            ],
            'daily_revenue' => $dailyRevenue,
            'top_products' => $topProductsByProfit,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    /**
     * Laporan Keuangan Detail (Financial Report)
     * Menampilkan detail transaksi, metode pembayaran, dll
     */
    public function financial(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Ambil parameter tanggal
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        // 1. BREAKDOWN METODE PEMBAYARAN
        $paymentMethods = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total_amount) as total')
            ->groupBy('payment_method')
            ->get();

        // 2. TRANSAKSI PER KASIR
        $transactionsByCashier = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->with('cashier:id,name')
            ->selectRaw('user_id, COUNT(*) as count, SUM(total_amount) as total')
            ->groupBy('user_id')
            ->get();

        // 3. TOTAL PENDAPATAN
        $totalRevenue = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum('total_amount');

        return Inertia::render('Reports/Financial', [
            'payment_methods' => $paymentMethods,
            'cashier_performance' => $transactionsByCashier,
            'total_revenue' => $totalRevenue,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    /**
     * Export Profit Loss ke Excel
     */
    public function exportProfitLossExcel(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        $filename = 'Laporan_Laba_Rugi_' . $startDate . '_to_' . $endDate . '.xlsx';

        return Excel::download(new ProfitLossExport($startDate, $endDate), $filename);
    }

    /**
     * Export Financial Report ke Excel
     */
    public function exportFinancialExcel(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        $filename = 'Laporan_Keuangan_' . $startDate . '_to_' . $endDate . '.xlsx';

        return Excel::download(new FinancialReportExport($startDate, $endDate), $filename);
    }

    /**
     * Export Profit Loss ke PDF (Simple HTML)
     */
    public function exportProfitLossPDF(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        // Get data
        $totalRevenue = Transaction::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum('total_amount');

        $cogs = DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $tenantId)
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum(DB::raw('transaction_details.quantity * products.cost_price'));

        $grossProfit = $totalRevenue - $cogs;
        $grossProfitMargin = $totalRevenue > 0 ? ($grossProfit / $totalRevenue) * 100 : 0;

        $topProducts = DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $tenantId)
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_details.quantity) as total_sold'),
                DB::raw('SUM(transaction_details.subtotal) as revenue'),
                DB::raw('SUM(transaction_details.quantity * products.cost_price) as cogs'),
                DB::raw('SUM(transaction_details.subtotal - (transaction_details.quantity * products.cost_price)) as profit')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('profit')
            ->limit(10)
            ->get();

        $data = [
            'tenant' => $user->tenant,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_revenue' => $totalRevenue,
            'cogs' => $cogs,
            'gross_profit' => $grossProfit,
            'gross_profit_margin' => round($grossProfitMargin, 2),
            'top_products' => $topProducts,
        ];

        // Simple HTML PDF (no need for blade template)
        $html = view('pdf.profit-loss', $data)->render();
        $pdf = Pdf::loadHTML($html);
        return $pdf->download('Laporan_Laba_Rugi_' . $startDate . '_to_' . $endDate . '.pdf');
    }
}
