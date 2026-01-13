<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'action_type',
        'description',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array', // Otomatis convert JSON ke array
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Tenant
    public function tenant()
    {
        return $this->belongsTo(Store::class, 'tenant_id');
    }
}
