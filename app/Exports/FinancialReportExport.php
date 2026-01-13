<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FinancialReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles
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
        return Transaction::where('tenant_id', $this->tenantId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59'])
            ->with('cashier:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Invoice',
            'Tanggal',
            'Waktu',
            'Kasir',
            'Total (Rp)',
            'Metode Pembayaran',
            'Tunai (Rp)',
            'Kembalian (Rp)'
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->invoice_code,
            $transaction->created_at->format('d/m/Y'),
            $transaction->created_at->format('H:i:s'),
            $transaction->cashier->name ?? '-',
            $transaction->total_amount,
            strtoupper($transaction->payment_method),
            $transaction->cash_amount,
            $transaction->change_amount
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
