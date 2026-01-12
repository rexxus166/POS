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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            // Relasi ke Tenant (Toko) & User (Kasir)
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Kasir

            $table->string('invoice_code'); // Contoh: INV-20240112-001
            $table->decimal('total_amount', 15, 2);
            $table->decimal('cash_amount', 15, 2)->default(0); // Uang yang diterima (kalau cash)
            $table->decimal('change_amount', 15, 2)->default(0); // Kembalian
            $table->string('payment_method'); // 'cash' atau 'qris'
            $table->string('status')->default('pending'); // pending, paid, cancelled

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
