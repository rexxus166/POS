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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('business_name');
            $table->string('slug')->unique(); // contoh: pos-kita.com/kopi-kenangan
            $table->string('address')->nullable();

            // --- FITUR QRIS ---
            $table->string('qris_static_image')->nullable(); // Path gambar yang diupload
            $table->text('qris_raw_string')->nullable(); // String hasil decode (untuk dimanipulasi jadi dinamis)

            // --- FITUR CUSTOMISASI (JSON) ---
            // Isinya nanti: {"logo": "path.jpg", "footer_struk": "Terima kasih", "tax_rate": 11, "service_charge": 5}
            $table->json('settings')->nullable();

            // --- SUBSCRIPTION ---
            $table->date('subscription_ends_at')->nullable(); // Tanggal habis masa aktif
            $table->enum('status', ['active', 'inactive', 'trial', 'suspended'])->default('trial');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
