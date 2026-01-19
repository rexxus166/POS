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
        Schema::create('product_recipes', function (Blueprint $table) {
            $table->id();

            // Relasi ke produk dan bahan mentah
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('raw_material_id')->constrained()->onDelete('cascade');

            // Jumlah bahan yang dibutuhkan per unit produk
            // Contoh: 1 Es Kopi Susu butuh 20 gram kopi, 200 ml susu
            $table->decimal('quantity', 10, 2); // Jumlah bahan per produk

            $table->timestamps();

            // Unique constraint: Satu produk tidak bisa punya bahan yang sama 2x
            $table->unique(['product_id', 'raw_material_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_recipes');
    }
};
