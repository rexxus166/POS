<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProfitLossExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $startDate;
    protected $endDate;
    protected $tenantId;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->tenantId = Auth::user()->tenant_id;
    }

    public function collection()
    {
        return DB::table('transaction_details')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.tenant_id', $this->tenantId)
            ->where('transactions.status', 'paid')
            ->whereBetween('transactions.created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59'])
            ->select(
                'products.name as product_name',
                DB::raw('SUM(transaction_details.quantity) as total_sold'),
                DB::raw('SUM(transaction_details.subtotal) as revenue'),
                DB::raw('SUM(transaction_details.quantity * products.cost_price) as cogs'),
                DB::raw('SUM(transaction_details.subtotal - (transaction_details.quantity * products.cost_price)) as profit')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('profit')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Nama Produk',
            'Total Terjual',
            'Pendapatan (Rp)',
            'HPP (Rp)',
            'Profit (Rp)',
            'Margin (%)'
        ];
    }

    public function map($row): array
    {
        $margin = $row->revenue > 0 ? ($row->profit / $row->revenue) * 100 : 0;

        return [
            $row->product_name,
            $row->total_sold,
            $row->revenue,
            $row->cogs,
            $row->profit,
            round($margin, 2) . '%'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
