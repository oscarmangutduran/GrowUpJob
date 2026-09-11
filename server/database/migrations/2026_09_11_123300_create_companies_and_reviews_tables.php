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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('sector');
            $table->string('size'); // e.g. '250–500 emp.', '+1000 emp.'
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->integer('rating_count')->default(0);
            $table->integer('vacantes')->default(0);
            $table->text('descripcion');
            $table->string('logo_color')->default('bg-blue-100 text-blue-700');
            $table->string('logo_icon')->default('tech'); // 'tech', 'green', 'fintech', 'pharma'
            $table->string('filter_tag')->default('Tecnología');
            $table->integer('top_cultura_rank')->nullable();
            $table->text('top_cultura_quote')->nullable();
            $table->json('insignias_obtenidas')->nullable(); // badges earned from worker review votes
            $table->timestamps();
        });

        Schema::create('company_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('autor');
            $table->string('cargo');
            $table->text('texto');
            $table->tinyInteger('rating')->default(5); // 1 to 5 stars
            $table->string('fecha')->nullable();
            $table->json('insignias_votadas')->nullable(); // worker-voted badges: ['ambiente', 'flexible', ...]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_reviews');
        Schema::dropIfExists('companies');
    }
};
