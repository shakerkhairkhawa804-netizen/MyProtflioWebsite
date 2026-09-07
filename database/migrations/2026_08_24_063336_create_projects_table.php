<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {

            $table->id();

            $table->string('title');

            $table->string('category');

            $table->text('description');

            $table->json('technologies')->nullable();

            $table->string('status')->default('New');

            $table->string('icon')->nullable();

            $table->string('gradient')->default('project-cyan');

            $table->string('live_url')->nullable();

            $table->string('github_url')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};