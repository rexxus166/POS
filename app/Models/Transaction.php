<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = ['id'];

    // Relasi ke detail item
    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    // Relasi ke Kasir
    public function cashier()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Tenant (Toko)
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
