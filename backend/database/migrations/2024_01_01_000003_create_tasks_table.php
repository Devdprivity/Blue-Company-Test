<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 150);
            $table->string('prioridad')->default('media');
            $table->string('estado')->default('pendiente');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['project_id', 'estado', 'prioridad']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
