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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('badge'); // 'gratis', 'ocupados', 'camara', 'internacional'
            $table->string('badge_label');
            $table->string('horas'); // e.g. '60h lectivas'
            $table->string('nivel'); // 'Nivel Intermedio', 'B2-C1', 'Avanzado', 'Todos los niveles'
            $table->string('modalidad'); // 'Online flexible', 'Clases en vivo', 'Online + Examen'
            $table->string('area')->nullable(); // 'Tecnología & IA', 'Ciberseguridad', 'Idiomas y Negocios', 'Gestión & Agile'
            $table->json('extras')->nullable(); // ['Insignia Digital Blockchain', ...]
            $table->json('tags')->nullable();
            $table->decimal('rating', 3, 1)->nullable();
            $table->integer('rating_count')->default(0);
            $table->string('precio'); // '100% Gratuito', 'Desde 299€', 'Consultar precio'
            $table->string('precio_label')->nullable();
            $table->string('inicio')->nullable();
            $table->string('aprobados')->nullable();
            $table->string('cta_label')->default('Inscribirme');
            $table->string('cta_variant')->default('primary'); // 'primary', 'secondary', 'outline'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
