<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PosController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProfileController;
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

    // --- A. DASHBOARD SUPER ADMIN (OWNER APLIKASI) ---
    Route::get('/super-dashboard', function () {
        return Inertia::render('SuperAdmin/Dashboard');
    })->middleware('role:owner')->name('super.dashboard');


    // --- B. DASHBOARD TENANT (PEMILIK TOKO) ---
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('role:admin')->name('dashboard');


    // --- C. POS SYSTEM & TRANSAKSI ---
    Route::middleware(['role:admin,cashier'])->group(function () {
        Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('/transaction/qris', [TransactionController::class, 'generateQris'])->name('transaction.qris');
        Route::post('/transaction/store', [TransactionController::class, 'store'])->name('transaction.store');
    });


    // --- D. SETTINGS ---
    // Route GET (Menampilkan Halaman)
    Route::get('/settings', function () {
        $user = Auth::user();
        // Gunakan Tenant, bukan Store (Karena kita pakai logic Tenant di controller lain)
        $store = $user->tenant;

        // Map fields if necessary (Tenant has business_name, Store expects name)
        if ($store) {
            $store->name = $store->business_name;
        }

        return Inertia::render('Settings/Index', [
            'store' => $store,
            'auth' => ['user' => $user]
        ]);
    })->middleware('role:admin')->name('settings');

    // [BARU] Route POST (Menyimpan Perubahan & Upload Gambar)
    Route::post('/settings/update', [StoreController::class, 'update'])
        ->middleware('role:admin')
        ->name('store.update');


    // --- E. PROFILE SETTINGS (Bawaan Breeze) ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
