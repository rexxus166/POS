<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ---------------------------------------------------
        // 1. SUPER ADMIN (Kamu / Owner Aplikasi SaaS)
        // ---------------------------------------------------
        User::create([
            'name' => 'Super Owner',
            'email' => 'owner@pos.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'tenant_id' => null, // Tidak terikat toko manapun
        ]);

        // ---------------------------------------------------
        // 2. TENANT 1: CAFE (Contoh Usaha F&B)
        // ---------------------------------------------------

        // A. Buat User Admin Toko dulu
        $cafeAdmin = User::create([
            'name' => 'Juragan Kopi',
            'email' => 'admin@kopi.com', // Login pakai ini nanti
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // B. Buat Toko-nya (Tenant)
        $cafeTenant = Tenant::create([
            'user_id' => $cafeAdmin->id,
            'business_name' => 'Kopi Senja & Logika',
            'slug' => 'kopi-senja',
            'address' => 'Jl. Koding No. 404, Jakarta',
            'status' => 'active',
            // Contoh JSON Settings (Customisasi User)
            'settings' => [
                'tax_rate' => 11, // PPN 11%
                'service_charge' => 5, // Service 5%
                'print_logo' => true,
                'footer_struk' => 'Terima kasih, coding itu indah!',
                'wifi_pass' => 'kopihitam'
            ],
            // Contoh String QRIS Mentah (Simulasi)
            'qris_raw_string' => '00020101021226580016ID.CO.GOPAY.WWW01189360091800000854270215000008542702150303UMI51440014ID.CO.QRIS.WWW0215ID10200212724960303UMI5204581253033605802ID5909KopiSenja6006Bekasi61051741162070703A016304D86E'
        ]);

        // C. Update User Admin biar punya tenant_id
        $cafeAdmin->update(['tenant_id' => $cafeTenant->id]);

        // D. Buat Kasir untuk Cafe ini
        User::create([
            'name' => 'Kasir Santuy',
            'email' => 'kasir@kopi.com', // Login Kasir
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'tenant_id' => $cafeTenant->id,
        ]);

        // E. Buat Produk Cafe (Contoh Penggunaan JSON Attributes)

        // Produk 1: Minuman (Ada Varian Sugar & Ice)
        Product::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Es Kopi Susu Gula Aren',
            'sku' => 'KOPI-001',
            'price' => 18000,
            'stock' => 100,
            'is_stock_managed' => true,
            'attributes' => [
                'type' => 'beverage',
                'sugar' => ['Less', 'Normal', 'Extra'], // Opsi Kustom
                'ice' => ['Less', 'Normal'],
                'topping' => ['Jelly', 'Boba']
            ]
        ]);

        // Produk 2: Makanan (Ada Level Pedas)
        Product::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Mie Goreng Coding',
            'sku' => 'FOOD-001',
            'price' => 25000,
            'stock' => 50,
            'is_stock_managed' => true,
            'attributes' => [
                'type' => 'food',
                'spicy_level' => [0, 1, 2, 3, 4, 5],
                'note' => 'Bisa request tanpa bawang'
            ]
        ]);

        // F. [BARU] Buat Bahan Mentah untuk Cafe
        $kopiArabica = \App\Models\RawMaterial::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Kopi Arabica',
            'sku' => 'RM-KOPI-001',
            'stock' => 5000, // 5 kg
            'unit' => 'gram',
            'cost_per_unit' => 150, // Rp 150/gram
            'min_stock' => 1000, // Alert jika < 1kg
            'category' => 'Bahan Baku',
            'supplier' => 'Toko Kopi Nusantara',
        ]);

        $susuUHT = \App\Models\RawMaterial::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Susu UHT Full Cream',
            'sku' => 'RM-SUSU-001',
            'stock' => 10000, // 10 liter
            'unit' => 'ml',
            'cost_per_unit' => 15, // Rp 15/ml
            'min_stock' => 2000, // Alert jika < 2 liter
            'category' => 'Bahan Baku',
            'supplier' => 'Distributor Susu',
        ]);

        $gulaAren = \App\Models\RawMaterial::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Gula Aren Cair',
            'sku' => 'RM-GULA-001',
            'stock' => 3000, // 3 liter
            'unit' => 'ml',
            'cost_per_unit' => 20, // Rp 20/ml
            'min_stock' => 500,
            'category' => 'Bahan Baku',
            'supplier' => 'Toko Gula Manis',
        ]);

        $esBatu = \App\Models\RawMaterial::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Es Batu',
            'sku' => 'RM-ES-001',
            'stock' => 20000, // 20 kg
            'unit' => 'gram',
            'cost_per_unit' => 2, // Rp 2/gram
            'min_stock' => 5000,
            'category' => 'Bahan Pendukung',
            'supplier' => 'Pabrik Es',
        ]);

        $mieInstan = \App\Models\RawMaterial::create([
            'tenant_id' => $cafeTenant->id,
            'name' => 'Mie Instan Premium',
            'sku' => 'RM-MIE-001',
            'stock' => 100, // 100 bungkus
            'unit' => 'pcs',
            'cost_per_unit' => 5000, // Rp 5.000/pcs
            'min_stock' => 20,
            'category' => 'Bahan Baku',
            'supplier' => 'Grosir Mie',
        ]);

        // G. [BARU] Buat Resep untuk Produk Cafe
        // Resep untuk "Es Kopi Susu Gula Aren"
        $kopiSusu = Product::where('sku', 'KOPI-001')->first();
        \App\Models\ProductRecipe::create([
            'product_id' => $kopiSusu->id,
            'raw_material_id' => $kopiArabica->id,
            'quantity' => 20, // 20 gram kopi per cup
        ]);
        \App\Models\ProductRecipe::create([
            'product_id' => $kopiSusu->id,
            'raw_material_id' => $susuUHT->id,
            'quantity' => 200, // 200 ml susu per cup
        ]);
        \App\Models\ProductRecipe::create([
            'product_id' => $kopiSusu->id,
            'raw_material_id' => $gulaAren->id,
            'quantity' => 30, // 30 ml gula aren per cup
        ]);
        \App\Models\ProductRecipe::create([
            'product_id' => $kopiSusu->id,
            'raw_material_id' => $esBatu->id,
            'quantity' => 150, // 150 gram es per cup
        ]);

        // Resep untuk "Mie Goreng Coding"
        $mieGoreng = Product::where('sku', 'FOOD-001')->first();
        \App\Models\ProductRecipe::create([
            'product_id' => $mieGoreng->id,
            'raw_material_id' => $mieInstan->id,
            'quantity' => 1, // 1 bungkus mie per porsi
        ]);



        // ---------------------------------------------------
        // 3. TENANT 2: JASA POTONG RAMBUT (Contoh Usaha Jasa)
        // ---------------------------------------------------

        $barberAdmin = User::create([
            'name' => 'Bang Cukur',
            'email' => 'admin@barber.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $barberTenant = Tenant::create([
            'user_id' => $barberAdmin->id,
            'business_name' => 'Barbershop Ganteng',
            'slug' => 'barber-ganteng',
            'address' => 'Jl. Ganteng Maksimal No. 1',
            'status' => 'trial',
            'settings' => [
                'tax_rate' => 0,
                'service_charge' => 0,
                'footer_struk' => 'Ganteng itu pilihan.',
            ]
        ]);

        $barberAdmin->update(['tenant_id' => $barberTenant->id]);

        // Produk Jasa (Tanpa Stok, Ada Durasi)
        Product::create([
            'tenant_id' => $barberTenant->id,
            'name' => 'Gentleman Cut + Wash',
            'sku' => 'SVC-001',
            'price' => 50000,
            'stock' => 0,
            'is_stock_managed' => false, // Unlimited karena jasa
            'attributes' => [
                'type' => 'service',
                'duration_minutes' => 45,
                'stylist' => ['Budi', 'Andi', 'Romi'] // Pilihan Karyawan
            ]
        ]);
    }
}
