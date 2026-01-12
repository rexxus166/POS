<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Store; // Pastikan model Tenant/Store kamu namanya 'Store' atau sesuaikan
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function index()
    {
        // 1. Hitung Statistik Global
        $stats = [
            'total_stores' => Store::count(),
            'total_users' => User::count(),
            // Hitung total transaksi dari semua toko (status paid)
            'total_transactions' => Transaction::where('status', 'paid')->count(),
            // Hitung total uang yang berputar di sistem (Gross Merchandise Value)
            'total_gmv' => Transaction::where('status', 'paid')->sum('total_amount'),
        ];

        // 2. Ambil Daftar Toko Terbaru (5 Terakhir)
        $latest_stores = Store::with('user') // Asumsi ada relasi ke owner
            ->latest()
            ->take(5)
            ->get();

        // 3. Ambil Transaksi Terbaru Global (Monitoring Live)
        $latest_transactions = Transaction::with(['tenant', 'cashier'])
            ->where('status', 'paid')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => $stats,
            'latest_stores' => $latest_stores,
            'latest_transactions' => $latest_transactions
        ]);
    }

    public function tenants(Request $request)
    {
        $query = Store::with('user')
            ->withCount('products', 'transactions')
            ->latest();

        if ($request->search) {
            // GANTI 'name' JADI 'business_name'
            $query->where('business_name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    // 2. TOGGLE STATUS (SUSPEND / ACTIVATE)
    public function toggleStatus($id)
    {
        $store = Store::findOrFail($id);

        // Cek status saat ini (String)
        if ($store->status === 'suspended') {
            // Kalau sedang suspend, aktifkan kembali
            $store->status = 'active';
            $msg = 'Toko berhasil diaktifkan kembali.';
        } else {
            // Kalau active atau trial, kita suspend
            $store->status = 'suspended';
            $msg = 'Toko berhasil disuspend.';
        }

        $store->save();

        return redirect()->back()->with('success', $msg);
    }

    // 3. HAPUS TOKO PERMANEN
    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();
        // Note: Idealnya usernya juga dihapus atau di-detach, tapi ini basic dulu.

        return redirect()->back()->with('success', 'Toko berhasil dihapus permanen.');
    }
}
