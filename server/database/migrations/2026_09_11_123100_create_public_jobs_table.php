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
        Schema::create('public_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('organismo');
            $table->string('status'); // 'urgente', 'abierto', 'listas', 'proximamente'
            $table->string('status_label');
            $table->string('status_days')->nullable();
            $table->string('subgrupo'); // 'A1', 'A2', 'C1', 'C2'
            $table->string('subgrupo_color')->nullable();
            $table->string('ambit')->nullable(); // 'Estado (AGE)', 'Comunidades', 'Local', 'Sanitario', 'Docente'
            $table->integer('plazas')->default(1);
            $table->string('requisito');
            $table->string('regimen');
            $table->string('sistema')->nullable();
            $table->string('cta_label')->default('Ver bases en BOE');
            $table->string('cta_variant')->default('primary'); // 'primary', 'warning', 'success', 'ghost'
            $table->text('extra_info')->nullable();
            $table->string('boe_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('public_jobs');
    }
};
