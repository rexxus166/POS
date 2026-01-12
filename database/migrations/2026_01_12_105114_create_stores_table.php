<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            // Menghubungkan toko dengan user (pemilik)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->text('description')->nullable();

            // Ini kolom penting yang tadi bikin error di Frontend
            $table->string('qris_static_image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
