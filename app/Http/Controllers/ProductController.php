<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;

class ProductController extends Controller
{
    // 1. TAMPILKAN DAFTAR PRODUK
    public function index()
    {
        $user = Auth::user();

        // Ambil produk milik toko user ini, urutkan dari yang terbaru
        // Ambil produk milik toko user ini, urutkan dari yang terbaru
        $products = Product::where('tenant_id', $user->tenant_id)
            ->latest()
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    // 2. SIMPAN PRODUK BARU
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'tenant_id' => $user->tenant_id, // Sesuaikan dengan nama kolom di tabelmu (store_id atau tenant_id)
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
            'category' => $request->category,
            'image' => $imagePath,
            'is_stock_managed' => true, // Default
        ]);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan!');
    }

    // 3. UPDATE PRODUK
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $product = Product::where('tenant_id', $user->tenant_id)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Update data text
        $product->name = $request->name;
        $product->price = $request->price;
        $product->stock = $request->stock;
        $product->category = $request->category;

        // Cek jika ada upload gambar baru
        if ($request->hasFile('image')) {
            // Hapus gambar lama biar server gak penuh
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->save();

        return redirect()->back()->with('success', 'Produk berhasil diperbarui!');
    }

    // 4. HAPUS PRODUK
    public function destroy($id)
    {
        $user = Auth::user();
        $product = Product::where('tenant_id', $user->tenant_id)->findOrFail($id);

        // Hapus gambarnya dulu
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus!');
    }
}
