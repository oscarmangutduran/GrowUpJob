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
        Schema::table('job_listings', function (Blueprint $table) {
            $table->string('modality')->default('Presencial')->after('type'); // '100% Remoto', 'Híbrido', 'Presencial'
            $table->string('jornada')->default('Completa')->after('modality'); // 'Completa', 'Parcial'
            $table->json('tags')->nullable()->after('jornada');
            $table->boolean('verified')->default(false)->after('tags');
            $table->string('badge')->nullable()->after('verified'); // e.g. 'Destacada'
            $table->boolean('fast_apply')->default(false)->after('badge');
            $table->string('logo_color')->nullable()->after('fast_apply');
            $table->string('logo_initial')->nullable()->after('logo_color');
            $table->string('salary_color')->nullable()->after('logo_initial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn([
                'modality',
                'jornada',
                'tags',
                'verified',
                'badge',
                'fast_apply',
                'logo_color',
                'logo_initial',
                'salary_color',
            ]);
        });
    }
};
