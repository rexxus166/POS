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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade'); // Isolasi per toko
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa yang melakukan

            // Jenis aktivitas: login, logout, transaction, product_create, product_update, product_delete, etc
            $table->string('action_type');

            // Deskripsi aktivitas (contoh: "Membuat produk Kopi Susu")
            $table->text('description');

            // Data tambahan dalam format JSON (contoh: {"product_id": 123, "old_price": 10000, "new_price": 15000})
            $table->json('metadata')->nullable();

            // IP Address & User Agent untuk security tracking
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            // Index untuk performa query
            $table->index(['tenant_id', 'created_at']);
            $table->index(['user_id', 'action_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
