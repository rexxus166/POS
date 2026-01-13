<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Tampilkan halaman Activity Logs
     * Fitur ini HANYA untuk Pro Business
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Filter berdasarkan parameter
        $actionType = $request->input('action_type');
        $userId = $request->input('user_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Query dasar
        $query = ActivityLog::where('tenant_id', $tenantId)
            ->with('user:id,name,role')
            ->latest();

        // Apply filters
        if ($actionType) {
            $query->where('action_type', $actionType);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        }

        // Pagination
        $logs = $query->paginate(20)->withQueryString();

        // Ambil daftar user untuk filter dropdown
        $users = \App\Models\User::where('tenant_id', $tenantId)
            ->select('id', 'name', 'role')
            ->get();

        // Daftar action types untuk filter
        $actionTypes = [
            'login' => 'Login',
            'logout' => 'Logout',
            'transaction' => 'Transaksi',
            'product_create' => 'Buat Produk',
            'product_update' => 'Update Produk',
            'product_delete' => 'Hapus Produk',
            'employee_create' => 'Tambah Karyawan',
            'employee_delete' => 'Hapus Karyawan',
        ];

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'users' => $users,
            'actionTypes' => $actionTypes,
            'filters' => [
                'action_type' => $actionType,
                'user_id' => $userId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
