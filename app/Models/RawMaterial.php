<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'stock' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'min_stock' => 'decimal:2',
    ];

    // Relasi: Bahan mentah milik satu tenant
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    // Relasi: Bahan mentah digunakan di banyak resep produk
    public function recipes()
    {
        return $this->hasMany(ProductRecipe::class);
    }

    // Relasi: Bahan mentah punya banyak history transaksi
    public function transactions()
    {
        return $this->hasMany(RawMaterialTransaction::class);
    }

    // Accessor: Status stok (aman, perhatian, menipis)
    public function getStockStatusAttribute()
    {
        if ($this->stock > $this->min_stock * 1.5) {
            return 'safe'; // 🟢 Aman
        } elseif ($this->stock > $this->min_stock) {
            return 'warning'; // 🟡 Perhatian
        } else {
            return 'low'; // 🔴 Menipis
        }
    }

    // Accessor: Warna status untuk UI
    public function getStockStatusColorAttribute()
    {
        return match ($this->stock_status) {
            'safe' => 'green',
            'warning' => 'yellow',
            'low' => 'red',
        };
    }

    // Accessor: Label status
    public function getStockStatusLabelAttribute()
    {
        return match ($this->stock_status) {
            'safe' => 'Aman',
            'warning' => 'Perhatian',
            'low' => 'Menipis',
        };
    }

    // Scope: Filter bahan yang stoknya menipis
    public function scopeLowStock($query)
    {
        return $query->whereRaw('stock <= min_stock');
    }

    // Scope: Filter berdasarkan kategori
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
