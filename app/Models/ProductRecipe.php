<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductRecipe extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'quantity' => 'decimal:2',
    ];

    // Relasi: Resep milik satu produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relasi: Resep menggunakan satu bahan mentah
    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }

    // Helper: Hitung total kebutuhan bahan untuk qty produk tertentu
    public function calculateRequirement($productQuantity)
    {
        return $this->quantity * $productQuantity;
    }
}
