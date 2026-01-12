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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->string('sku')->nullable()->index(); // Kode barang/barcode

            // Gunakan decimal untuk uang, jangan integer/float biar presisi
            $table->decimal('price', 15, 2);
            $table->decimal('cost_price', 15, 2)->default(0); // HPP (Modal)

            // Stok management
            $table->integer('stock')->default(0);
            $table->boolean('is_stock_managed')->default(true);
            $table->string('category')->default('General');

            // --- FITUR CUSTOMISASI PRODUK (JSON) ---
            // Isinya: {"size": ["M", "L"], "color": ["Red"], "topping": [...]}
            $table->json('attributes')->nullable();

            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
