<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log aktivitas user
     * 
     * @param string $actionType - Jenis aktivitas (login, logout, transaction, product_create, dll)
     * @param string $description - Deskripsi aktivitas
     * @param array|null $metadata - Data tambahan (opsional)
     * @return ActivityLog|null
     */
    public static function log(string $actionType, string $description, ?array $metadata = null): ?ActivityLog
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return null;
        }

        $user = Auth::user();

        // Pastikan user punya tenant_id
        if (!$user->tenant_id) {
            return null;
        }

        return ActivityLog::create([
            'tenant_id' => $user->tenant_id,
            'user_id' => $user->id,
            'action_type' => $actionType,
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log login
     */
    public static function logLogin(): void
    {
        self::log(
            'login',
            Auth::user()->name . ' login ke sistem',
            ['login_time' => now()->toDateTimeString()]
        );
    }

    /**
     * Log logout
     */
    public static function logLogout(): void
    {
        self::log(
            'logout',
            Auth::user()->name . ' logout dari sistem',
            ['logout_time' => now()->toDateTimeString()]
        );
    }

    /**
     * Log transaksi
     */
    public static function logTransaction(int $transactionId, float $amount, string $paymentMethod): void
    {
        self::log(
            'transaction',
            'Transaksi berhasil - ' . number_format($amount, 0, ',', '.'),
            [
                'transaction_id' => $transactionId,
                'amount' => $amount,
                'payment_method' => $paymentMethod,
            ]
        );
    }

    /**
     * Log create produk
     */
    public static function logProductCreate(int $productId, string $productName): void
    {
        self::log(
            'product_create',
            'Membuat produk baru: ' . $productName,
            ['product_id' => $productId]
        );
    }

    /**
     * Log update produk
     */
    public static function logProductUpdate(int $productId, string $productName, array $changes = []): void
    {
        self::log(
            'product_update',
            'Mengupdate produk: ' . $productName,
            [
                'product_id' => $productId,
                'changes' => $changes
            ]
        );
    }

    /**
     * Log delete produk
     */
    public static function logProductDelete(int $productId, string $productName): void
    {
        self::log(
            'product_delete',
            'Menghapus produk: ' . $productName,
            ['product_id' => $productId]
        );
    }

    /**
     * Log create karyawan
     */
    public static function logEmployeeCreate(int $employeeId, string $employeeName): void
    {
        self::log(
            'employee_create',
            'Menambahkan karyawan baru: ' . $employeeName,
            ['employee_id' => $employeeId]
        );
    }

    /**
     * Log delete karyawan
     */
    public static function logEmployeeDelete(int $employeeId, string $employeeName): void
    {
        self::log(
            'employee_delete',
            'Menghapus karyawan: ' . $employeeName,
            ['employee_id' => $employeeId]
        );
    }
}
