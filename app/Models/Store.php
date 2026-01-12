<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    // Nama tabel (opsional jika sesuai standar plural, tapi biar yakin)
    protected $table = 'stores';

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'user_id',           // Pemilik toko
        'name',              // Nama Toko
        'address',           // Alamat
        'phone',             // Nomor HP Toko
        'description',       // Deskripsi singkat
        'qris_static_image', // Path gambar QRIS (Penting untuk Settings)
    ];

    // Relasi: Satu toko dimiliki oleh satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
