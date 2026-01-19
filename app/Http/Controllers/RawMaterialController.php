<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\RawMaterial;
use App\Models\RawMaterialTransaction;

class RawMaterialController extends Controller
{
    /**
     * Display a listing of raw materials
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Query dasar
        $query = RawMaterial::where('tenant_id', $tenantId);

        // Filter: Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('supplier', 'like', "%{$search}%");
            });
        }

        // Filter: Kategori
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter: Stok Menipis
        if ($request->has('low_stock') && $request->low_stock == 'true') {
            $query->lowStock();
        }

        // Ambil data dengan pagination
        $rawMaterials = $query->latest()->paginate(15)->withQueryString();

        // Hitung statistik
        $stats = [
            'total_items' => RawMaterial::where('tenant_id', $tenantId)->count(),
            'low_stock_count' => RawMaterial::where('tenant_id', $tenantId)->lowStock()->count(),
            'total_value' => RawMaterial::where('tenant_id', $tenantId)
                ->selectRaw('SUM(stock * cost_per_unit) as total')
                ->value('total') ?? 0,
        ];

        // Ambil kategori unik untuk filter
        $categories = RawMaterial::where('tenant_id', $tenantId)
            ->distinct()
            ->pluck('category');

        return Inertia::render('RawMaterials/Index', [
            'rawMaterials' => $rawMaterials,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'low_stock'])
        ]);
    }

    /**
     * Store a newly created raw material
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'stock' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'cost_per_unit' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();
        $validated['tenant_id'] = $user->tenant_id;

        try {
            DB::beginTransaction();

            $rawMaterial = RawMaterial::create($validated);

            // Catat transaksi awal (jika ada stok awal)
            if ($validated['stock'] > 0) {
                RawMaterialTransaction::create([
                    'tenant_id' => $user->tenant_id,
                    'raw_material_id' => $rawMaterial->id,
                    'transaction_type' => 'purchase',
                    'quantity' => $validated['stock'],
                    'stock_before' => 0,
                    'stock_after' => $validated['stock'],
                    'notes' => 'Stok awal',
                    'user_id' => $user->id,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Bahan mentah berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Gagal menambahkan bahan: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified raw material
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'unit' => 'required|string|max:50',
            'cost_per_unit' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();
        $rawMaterial = RawMaterial::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $rawMaterial->update($validated);

        return redirect()->back()->with('success', 'Bahan mentah berhasil diupdate!');
    }

    /**
     * Remove the specified raw material
     */
    public function destroy($id)
    {
        $user = Auth::user();

        try {
            $rawMaterial = RawMaterial::where('tenant_id', $user->tenant_id)
                ->findOrFail($id);

            // Cek apakah bahan ini digunakan di resep produk
            if ($rawMaterial->recipes()->exists()) {
                return redirect()->back()->with('error', 'Bahan ini masih digunakan di resep produk! Hapus resep terlebih dahulu.');
            }

            $rawMaterial->delete();

            return redirect()->back()->with('success', 'Bahan mentah berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus bahan: ' . $e->getMessage());
        }
    }

    /**
     * Restock raw material
     */
    public function restock(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            $rawMaterial = RawMaterial::where('tenant_id', $user->tenant_id)
                ->findOrFail($id);

            $stockBefore = $rawMaterial->stock;
            $stockAfter = $stockBefore + $validated['quantity'];

            // Update stok
            $rawMaterial->update(['stock' => $stockAfter]);

            // Catat transaksi
            RawMaterialTransaction::create([
                'tenant_id' => $user->tenant_id,
                'raw_material_id' => $rawMaterial->id,
                'transaction_type' => 'purchase',
                'quantity' => $validated['quantity'],
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'notes' => $validated['notes'] ?? 'Restock',
                'user_id' => $user->id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Stok berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Gagal restock: ' . $e->getMessage());
        }
    }

    /**
     * Get low stock materials (for dashboard widget)
     */
    public function getLowStock()
    {
        $user = Auth::user();

        $lowStockMaterials = RawMaterial::where('tenant_id', $user->tenant_id)
            ->lowStock()
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        return response()->json($lowStockMaterials);
    }

    /**
     * Adjust stock manually
     */
    public function adjust(Request $request, $id)
    {
        $validated = $request->validate([
            'new_stock' => 'required|numeric|min:0',
            'notes' => 'required|string',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            $rawMaterial = RawMaterial::where('tenant_id', $user->tenant_id)
                ->findOrFail($id);

            $stockBefore = $rawMaterial->stock;
            $stockAfter = $validated['new_stock'];
            $difference = $stockAfter - $stockBefore;

            // Update stok
            $rawMaterial->update(['stock' => $stockAfter]);

            // Catat transaksi
            RawMaterialTransaction::create([
                'tenant_id' => $user->tenant_id,
                'raw_material_id' => $rawMaterial->id,
                'transaction_type' => 'adjustment',
                'quantity' => $difference,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'notes' => $validated['notes'],
                'user_id' => $user->id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Stok berhasil disesuaikan!');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Gagal menyesuaikan stok: ' . $e->getMessage());
        }
    }

    /**
     * Get transaction history for a raw material
     */
    public function history($id)
    {
        $user = Auth::user();

        $rawMaterial = RawMaterial::where('tenant_id', $user->tenant_id)
            ->findOrFail($id);

        $transactions = RawMaterialTransaction::where('raw_material_id', $id)
            ->with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('RawMaterials/History', [
            'rawMaterial' => $rawMaterial,
            'transactions' => $transactions
        ]);
    }
}
