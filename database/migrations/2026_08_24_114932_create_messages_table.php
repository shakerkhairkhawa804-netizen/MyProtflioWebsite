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
        Schema::create('messages', function (Blueprint $table) {

            $table->id();

            // Sender Information
            $table->string('name', 100);

            $table->string('email', 150);

            // Message Information
            $table->string('subject', 200)->nullable();

            $table->text('message');

            // Message Status
            $table->enum('status', [
                'unread',
                'read',
            ])->default('unread');

            $table->timestamps();

            // Indexes
            $table->index('email');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};