<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\JobListing;
use Illuminate\Support\Facades\Hash;

class JobListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear o buscar un usuario tipo empresa
        $companyUser = User::firstOrCreate(
            ['email' => 'empresa@growupjob.com'],
            [
                'name' => 'Empresa Corporativa S.A.',
                'password' => Hash::make('password123'),
                'role' => 'empresa',
            ]
        );

        // Crear ofertas de trabajo de prueba
        JobListing::create([
            'user_id' => $companyUser->id,
            'title' => 'Desarrollador React Native Senior (Real API)',
            'company_name' => 'AppCreators S.A.',
            'description' => 'Buscamos un desarrollador React Native apasionado con experiencia sólida en el desarrollo de apps Android/iOS.',
            'location' => 'Remoto (Madrid)',
            'salary' => '48K - 55K €/año',
            'type' => 'Jornada Completa',
        ]);

        JobListing::create([
            'user_id' => $companyUser->id,
            'title' => 'Ingeniero Cloud DevOps (Real API)',
            'company_name' => 'Global Data Labs',
            'description' => 'Buscamos un especialista en AWS, Kubernetes e integración continua.',
            'location' => 'Barcelona',
            'salary' => '40K - 46K €/año',
            'type' => 'Híbrido',
        ]);

        JobListing::create([
            'user_id' => $companyUser->id,
            'title' => 'Diseñador de Interfaces UI/UX',
            'company_name' => 'Pixel Agency',
            'description' => 'Buscamos un diseñador con gran sentido estético para mejorar las interfaces móviles de nuestra suite.',
            'location' => 'Málaga',
            'salary' => '25K - 30K €/año',
            'type' => 'Remoto',
        ]);
    }
}
