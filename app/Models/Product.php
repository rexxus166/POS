<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'attributes' => 'array', // Otomatis convert JSON ke Array
        'is_stock_managed' => 'boolean',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    // Relasi: Produk punya banyak resep (komposisi bahan mentah)
    public function recipes()
    {
        return $this->hasMany(ProductRecipe::class);
    }

    // Helper: Cek apakah produk punya resep
    public function hasRecipe()
    {
        return $this->recipes()->exists();
    }
}
