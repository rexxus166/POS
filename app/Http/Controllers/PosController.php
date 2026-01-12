<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class PosController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Pastikan relasi tenant diambil
        $tenant = $user->tenant;

        // CEK: Kalau user gak punya toko (misal Super Admin), tendang balik
        if (!$tenant) {
            return redirect('/super-dashboard')->with('error', 'Anda tidak memiliki akses toko.');
        }

        // Ambil Produk milik toko ini saja
        $products = Product::where('tenant_id', $user->tenant_id)
            ->where('stock', '>', 0)
            ->orWhere(function ($query) {
                $query->where('is_stock_managed', false);
            })
            // Filter ulang tenant_id di dalam OR condition biar aman (logic strict)
            ->where('tenant_id', $user->tenant_id)
            ->get();

        // Map object tenant ke nama 'store' biar sesuai frontend baru
        // Kita clone atau inject property 'name' supaya sama dengan ekspektasi frontend (store.name)
        if ($tenant) {
            $tenant->name = $tenant->business_name;
        }

        return Inertia::render('POS/Index', [
            'products' => $products,
            'store' => $tenant, // Frontend minta props 'store'
            'auth' => ['user' => $user] // Frontend minta props 'auth'
        ]);
    }
}
