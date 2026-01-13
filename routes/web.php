<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PosController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\TransactionController;
use App\Models\Store;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- 1. PUBLIC ROUTE ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 2. AUTHENTICATED ROUTES (Harus Login Dulu) ---
Route::middleware(['auth', 'verified'])->group(function () {

    // [BARU] RUTE HALAMAN ERROR SUSPEND
    // Ditaruh di luar middleware 'store.status' supaya tidak looping redirect
    Route::get('/akun/suspended', function () {
        return Inertia::render('Errors/Suspended');
    })->name('store.suspended');

    // [BARU] RUTE HALAMAN ERROR EXPIRED
    Route::get('/akun/expired', function () {
        return Inertia::render('Errors/Expired');
    })->name('store.expired');


    // --- A. DASHBOARD SUPER ADMIN (OWNER APLIKASI) ---
    // Super Admin bebas akses, tidak perlu cek status toko
    Route::middleware(['role:owner'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [SuperAdminController::class, 'index'])->name('super.dashboard');

        // Kelola Tenants
        Route::get('/tenants', [SuperAdminController::class, 'tenants'])->name('super.tenants.index');
        Route::post('/tenants/{id}/toggle', [SuperAdminController::class, 'toggleStatus'])->name('super.tenants.toggle');
        Route::delete('/tenants/{id}', [SuperAdminController::class, 'destroy'])->name('super.tenants.destroy');
    });


    // --- GRUP MIDDLEWARE: CEK STATUS TOKO ---
    // Semua rute di dalam sini akan dicek: Apakah toko Active? Kalau Suspended -> Tendang keluar.
    Route::middleware(['store-status'])->group(function () {

        // --- B. DASHBOARD TENANT (PEMILIK TOKO) ---
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->middleware('role:admin')
            ->name('dashboard');

        // Manajemen Karyawan (Hanya Admin Toko)
        Route::resource('employees', EmployeeController::class)
            ->only(['index', 'store', 'destroy'])
            ->middleware('role:admin');

        // Manajemen Produk
        Route::resource('products', ProductController::class)
            ->middleware('role:admin');

        // --- [BARU] LAPORAN KEUANGAN (PRO BUSINESS ONLY) ---
        Route::middleware(['role:admin', 'subscription:pro'])->prefix('reports')->group(function () {
            Route::get('/profit-loss', [App\Http\Controllers\ReportController::class, 'profitLoss'])->name('reports.profit-loss');
            Route::get('/financial', [App\Http\Controllers\ReportController::class, 'financial'])->name('reports.financial');

            // Export routes
            Route::get('/profit-loss/export-excel', [App\Http\Controllers\ReportController::class, 'exportProfitLossExcel'])->name('reports.profit-loss.export-excel');
            Route::get('/profit-loss/export-pdf', [App\Http\Controllers\ReportController::class, 'exportProfitLossPDF'])->name('reports.profit-loss.export-pdf');
            Route::get('/financial/export-excel', [App\Http\Controllers\ReportController::class, 'exportFinancialExcel'])->name('reports.financial.export-excel');
        });

        // --- [BARU] LOG AKTIVITAS KARYAWAN (PRO BUSINESS ONLY) ---
        Route::get('/activity-logs', [App\Http\Controllers\ActivityLogController::class, 'index'])
            ->middleware(['role:admin', 'subscription:pro'])
            ->name('activity-logs.index');

        // --- C. SETTINGS ---
        Route::get('/settings', function () {
            $user = Auth::user();
            $store = $user->tenant;

            // Mapping nama bisnis untuk tampilan
            if ($store) {
                $store->name = $store->business_name;
            }

            return Inertia::render('Settings/Index', [
                'store' => $store,
                'auth' => ['user' => $user]
            ]);
        })->middleware('role:admin')->name('settings');

        Route::post('/settings/update', [StoreController::class, 'update'])
            ->middleware('role:admin')
            ->name('store.update');

        // --- D. POS SYSTEM & TRANSAKSI ---
        // Bisa diakses Admin & Kasir (Selama toko aktif)
        Route::middleware(['role:admin,cashier'])->group(function () {
            Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
            Route::post('/transaction/qris', [TransactionController::class, 'generateQris'])->name('transaction.qris');
            Route::post('/transaction/store', [TransactionController::class, 'store'])->name('transaction.store');

            // [UPDATE] Riwayat Transaksi - HANYA PRO BUSINESS
            Route::get('/transactions/history', [TransactionController::class, 'history'])
                ->middleware('subscription:pro') // [BARU] Batasi untuk Pro only
                ->name('transaction.history');
        });

        // Lihat Struk Belanja
        Route::get('/receipt/{invoice_code}', [TransactionController::class, 'show'])->name('transaction.receipt');
    });


    // --- E. PROFILE SETTINGS (Bawaan Breeze) ---
    // Ditaruh di luar store.status agar user tetap bisa edit profil/logout walau toko disuspend
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
