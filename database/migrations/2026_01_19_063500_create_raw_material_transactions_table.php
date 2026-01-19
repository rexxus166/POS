<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('raw_material_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('raw_material_id')->constrained()->onDelete('cascade');

            // Tipe transaksi
            $table->enum('transaction_type', ['purchase', 'usage', 'adjustment', 'waste']);
            // purchase = Beli/Restock
            // usage = Terpakai saat transaksi penjualan
            // adjustment = Penyesuaian manual (koreksi stok)
            // waste = Bahan terbuang/rusak

            // Jumlah perubahan (+ atau -)
            $table->decimal('quantity', 10, 2); // Bisa positif atau negatif

            // Snapshot stok
            $table->decimal('stock_before', 10, 2); // Stok sebelum transaksi
            $table->decimal('stock_after', 10, 2); // Stok sesudah transaksi

            // Referensi (opsional)
            $table->unsignedBigInteger('reference_id')->nullable(); // ID transaksi penjualan (jika type=usage)
            $table->text('notes')->nullable(); // Catatan

            // User yang melakukan
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->timestamps();

            // Index untuk query cepat
            $table->index(['tenant_id', 'raw_material_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raw_material_transactions');
    }
};
