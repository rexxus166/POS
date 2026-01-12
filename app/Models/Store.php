<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    // 1. ARAHKAN KE TABEL YANG BENAR
    protected $table = 'tenants';

    // 2. SESUAIKAN KOLOM FILLABLE
    protected $fillable = [
        'user_id',
        'business_name', // Ganti 'name' jadi 'business_name'
        'address',
        'phone',
        'description',
        'qris_static_image',
        'status',
        // Tambahkan kolom lain yang ada di tabel tenants kamu (misal: domain, logo, dll)
    ];

    // 3. JEMBATAN (ACCESSOR) PENTING!
    // Ini trik biar di Frontend React tetap bisa panggil 'tenant.name'
    // Walaupun di database aslinya 'business_name'
    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return $this->attributes['business_name'] ?? 'Tanpa Nama';
    }

    // --- RELASI ---

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        // Relasi ke produk (foreign key: tenant_id)
        return $this->hasMany(Product::class, 'tenant_id', 'id');
    }

    public function transactions()
    {
        // Relasi ke transaksi (foreign key: tenant_id)
        return $this->hasMany(Transaction::class, 'tenant_id', 'id');
    }
}
