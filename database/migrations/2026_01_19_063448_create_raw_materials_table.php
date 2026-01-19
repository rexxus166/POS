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
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');

            $table->string('name'); // Nama bahan (e.g., "Kopi Arabica", "Susu UHT")
            $table->string('sku')->nullable()->index(); // Kode bahan

            // Stok dengan decimal untuk presisi (support 0.5 kg, 1.25 liter, dll)
            $table->decimal('stock', 10, 2)->default(0); // Stok saat ini
            $table->string('unit'); // Satuan: ml, kg, liter, gram, pcs, unit, dll

            // Harga
            $table->decimal('cost_per_unit', 15, 2)->default(0); // Harga per satuan

            // Alert & Kategori
            $table->decimal('min_stock', 10, 2)->default(0); // Minimum stok untuk alert
            $table->string('category')->default('General'); // Kategori bahan

            // Info Supplier
            $table->string('supplier')->nullable(); // Nama supplier
            $table->text('notes')->nullable(); // Catatan tambahan

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raw_materials');
    }
};
