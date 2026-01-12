<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $guarded = ['id']; // Semua kolom boleh diisi kecuali ID

    protected $casts = [
        'settings' => 'array', // Otomatis convert JSON ke Array saat diambil
        'subscription_ends_at' => 'date',
    ];

    // Relasi: Tenant punya banyak produk
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Relasi: Tenant punya banyak karyawan (User)
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
