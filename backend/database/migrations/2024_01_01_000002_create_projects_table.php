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
            $table->string('nombre', 120);
            $table->string('estado')->default('nuevo');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('owner_id');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
