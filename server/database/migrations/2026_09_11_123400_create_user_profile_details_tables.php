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
        // 1. Add fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('disponible_remoto')->default(true)->after('location');
            $table->boolean('preseleccionada_activa')->default(true)->after('disponible_remoto');
            $table->string('visibilidad_directa')->default('+34%')->after('preseleccionada_activa');
            $table->string('anos_experiencia')->default('8+')->after('visibilidad_directa');
            $table->integer('match_global')->default(94)->after('anos_experiencia');
            $table->integer('ofertas_hoy')->default(14)->after('match_global');
            $table->string('cv_title')->default('CV_Elena_Morales_2025.pdf')->after('cv_path');
            $table->string('cv_size')->default('1.1 MB · PDF')->after('cv_title');
            $table->boolean('notificaciones')->default(true)->after('cv_size');
            $table->string('tema')->default('Hipnótico oscuro')->after('notificaciones');
            $table->boolean('visibilidad_reclutadores')->default(true)->after('tema');
        });

        // 2. User Experiences
        Schema::create('user_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('company');
            $table->string('org')->nullable();
            $table->string('period')->nullable();
            $table->text('desc')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('current')->default(false);
            $table->timestamps();
        });

        // 3. User Education & Certifications
        Schema::create('user_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('institution');
            $table->string('badge')->nullable(); // e.g. 'Vigente'
            $table->string('badge_color')->nullable();
            $table->string('icon_type')->default('degree'); // 'degree', 'cert'
            $table->timestamps();
        });

        // 4. User Languages
        Schema::create('user_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('flag')->default('🇪🇸');
            $table->string('language');
            $table->string('level');
            $table->string('color')->nullable();
            $table->timestamps();
        });

        // 5. User Portfolio & Links
        Schema::create('user_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type'); // 'github', 'linkedin', 'web'
            $table->string('url');
            $table->string('label');
            $table->string('color')->nullable();
            $table->timestamps();
        });

        // 6. Job Applications (Mi Candidatura)
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('job_listing_id')->nullable()->constrained('job_listings')->nullOnDelete();
            $table->string('title');
            $table->string('company');
            $table->string('status')->default('En revisión'); // 'En revisión', 'Enviadas', 'Entrevistas'
            $table->string('badge'); // 'Entrevista', 'Finalista', 'Invitación'
            $table->string('badge_color');
            $table->text('detail');
            $table->string('detail_icon')->nullable(); // 'video', 'star', 'check'
            $table->string('cta')->default('Ver detalles');
            $table->string('cta_color')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('user_links');
        Schema::dropIfExists('user_languages');
        Schema::dropIfExists('user_educations');
        Schema::dropIfExists('user_experiences');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'disponible_remoto',
                'preseleccionada_activa',
                'visibilidad_directa',
                'anos_experiencia',
                'match_global',
                'ofertas_hoy',
                'cv_title',
                'cv_size',
                'notificaciones',
                'tema',
                'visibilidad_reclutadores',
            ]);
        });
    }
};
