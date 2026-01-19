<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RawMaterialTransaction extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'quantity' => 'decimal:2',
        'stock_before' => 'decimal:2',
        'stock_after' => 'decimal:2',
    ];

    // Relasi: Transaksi milik satu tenant
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    // Relasi: Transaksi untuk satu bahan mentah
    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }

    // Relasi: Transaksi dilakukan oleh satu user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor: Label tipe transaksi
    public function getTransactionTypeLabelAttribute()
    {
        return match ($this->transaction_type) {
            'purchase' => 'Pembelian/Restock',
            'usage' => 'Terpakai (Penjualan)',
            'adjustment' => 'Penyesuaian',
            'waste' => 'Terbuang/Rusak',
        };
    }

    // Scope: Filter berdasarkan tipe
    public function scopeType($query, $type)
    {
        return $query->where('transaction_type', $type);
    }

    // Scope: Filter berdasarkan tanggal
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}
