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
* Export Profit Loss ke PDF
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

$pdf = Pdf::loadView('pdf.profit-loss', $data);
return $pdf->download('Laporan_Laba_Rugi_' . $startDate . '_to_' . $endDate . '.pdf');
}