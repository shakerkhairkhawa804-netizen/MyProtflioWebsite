<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('category')->nullable();

            $table->text('description');

            $table->json('features')->nullable();

            $table->string('icon')->default('⚡');
            $table->string('gradient')->default('service-cyan');

            $table->string('price')->nullable();

            $table->enum('status', [
                'New',
                'Featured',
                'Active',
                'Inactive'
            ])->default('New');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};