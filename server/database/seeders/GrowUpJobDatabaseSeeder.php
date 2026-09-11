<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\JobListing;
use App\Models\PublicJob;
use App\Models\Course;
use App\Models\Company;
use App\Models\CompanyReview;
use App\Models\UserExperience;
use App\Models\UserEducation;
use App\Models\UserLanguage;
use App\Models\UserLink;
use App\Models\JobApplication;

class GrowUpJobDatabaseSeeder extends Seeder
{
    /**
     * Seed all GrowUp Job entities with frontend-matching data.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // ── 1. Candidato Principal (Elena Morales García) ─────────────────────
        $user = User::updateOrCreate(
            ['email' => 'elena.morales@growupjob.com'],
            [
                'name' => 'Elena',
                'last_name' => 'Morales García',
                'headline' => 'Full Stack Engineer & Cloud Architect',
                'password' => Hash::make('password123'),
                'role' => 'trabajador',
                'phone' => '+34 612 345 678',
                'location' => 'Madrid, España',
                'disponible_remoto' => true,
                'preseleccionada_activa' => true,
                'visibilidad_directa' => '+34%',
                'anos_experiencia' => '8+',
                'match_global' => 94,
                'ofertas_hoy' => 14,
                'cv_title' => 'CV_Elena_Morales_2025.pdf',
                'cv_size' => '1.1 MB · PDF',
                'notificaciones' => true,
                'tema' => 'Hipnótico oscuro',
                'visibilidad_reclutadores' => true,
            ]
        );

        // Experiencias de Elena
        UserExperience::truncate();
        UserExperience::create([
            'user_id' => $user->id,
            'title' => 'Staff Cloud Engineer',
            'company' => 'DICE · Actualidad',
            'org' => 'Iberia Digital Solutions',
            'desc' => 'Liderazgo de equipo de arquitectura. Implementó microservicios en AWS con un 54% de mejora en el rendimiento bajo alta carga (2M y visible APIs activos).',
            'tags' => ['AWS', 'Terraform', 'Kotlin'],
            'current' => true,
        ]);
        UserExperience::create([
            'user_id' => $user->id,
            'title' => 'Full Stack Developer',
            'company' => 'Sofia Fintech Labs · Remoto',
            'period' => '2019 – 2022',
            'desc' => 'Contribuyó al núcleo de micro-frontend formando en React/TypeScript y vectores de seguridad de pagos hasta completamente alineados con la normativa PSD2.',
            'tags' => ['React', 'TypeScript', 'PSD2'],
            'current' => false,
        ]);

        // Educación de Elena
        UserEducation::truncate();
        UserEducation::create([
            'user_id' => $user->id,
            'title' => 'AWS Certified Solutions Architect Professional',
            'institution' => 'Vigente 2025 · #1 AWS-523231',
            'badge' => 'Vigente',
            'badge_color' => 'bg-green-100 text-green-700',
            'icon_type' => 'cert',
        ]);
        UserEducation::create([
            'user_id' => $user->id,
            'title' => 'Grado en Ingeniería del Software',
            'institution' => 'Universidad Politécnica de Madrid · 2014 – 2018',
            'icon_type' => 'degree',
        ]);

        // Idiomas de Elena
        UserLanguage::truncate();
        UserLanguage::create([
            'user_id' => $user->id,
            'flag' => '🇪🇸',
            'language' => 'Español',
            'level' => 'Nativo / Bilingüe',
            'color' => 'bg-red-50 border-red-100',
        ]);
        UserLanguage::create([
            'user_id' => $user->id,
            'flag' => '🇬🇧',
            'language' => 'Inglés',
            'level' => 'Certificado C1 · Cambridge',
            'color' => 'bg-blue-50 border-blue-100',
        ]);

        // Enlaces de Elena
        UserLink::truncate();
        UserLink::create([
            'user_id' => $user->id,
            'type' => 'github',
            'url' => 'https://github.com/elenamorales-dev',
            'label' => 'github.com/elenamorales-dev',
            'color' => 'text-gray-700',
        ]);
        UserLink::create([
            'user_id' => $user->id,
            'type' => 'linkedin',
            'url' => 'https://linkedin.com/in/elena-morales-dev',
            'label' => 'linkedin.com/elena-morales-dev',
            'color' => 'text-blue-600',
        ]);
        UserLink::create([
            'user_id' => $user->id,
            'type' => 'web',
            'url' => 'https://elenamorales.dev',
            'label' => 'elenamorales/engineering',
            'color' => 'text-purple-600',
        ]);

        // Candidaturas de Elena (Mi Candidatura)
        JobApplication::truncate();
        JobApplication::create([
            'user_id' => $user->id,
            'title' => 'Lead Full Stack',
            'company' => 'Frontend Inc.',
            'status' => 'En revisión',
            'badge' => 'Entrevista',
            'badge_color' => 'bg-blue-100 text-blue-700',
            'detail' => 'Jueves, 16:00 – 17:15 CST (Google Meet)',
            'detail_icon' => 'video',
            'cta' => 'Ver detalles',
            'cta_color' => 'text-blue-600 border border-blue-200 hover:bg-blue-50',
        ]);
        JobApplication::create([
            'user_id' => $user->id,
            'title' => 'Senior React Dev',
            'company' => 'DevPulsar Tech · Remoto (0–40)',
            'status' => 'En revisión',
            'badge' => 'Finalista',
            'badge_color' => 'bg-purple-100 text-purple-700',
            'detail' => 'Resultado: 89% Match',
            'detail_icon' => 'star',
            'cta' => 'Ver detalles',
            'cta_color' => 'text-purple-600 border border-purple-200 hover:bg-purple-50',
        ]);
        JobApplication::create([
            'user_id' => $user->id,
            'title' => 'Platform Architect',
            'company' => 'NX Cloud Systems',
            'status' => 'En revisión',
            'badge' => 'Invitación',
            'badge_color' => 'bg-green-100 text-green-700',
            'detail' => 'Feedback constructivo disponible. Tienes completa disposición de la presentación...',
            'detail_icon' => 'check',
            'cta' => 'Ver detalles',
            'cta_color' => 'text-green-600 border border-green-200 hover:bg-green-50',
        ]);

        // ── 2. Ofertas de Empleo (Job Listings) ───────────────────────────────
        JobListing::truncate();
        JobListing::create([
            'user_id' => $user->id,
            'title' => 'Senior Full Stack Engineer',
            'company_name' => 'DevPulse Tech',
            'location' => '100% Remoto',
            'salary' => '48K - 60K €',
            'type' => 'Jornada Completa',
            'modality' => '100% Remoto',
            'jornada' => 'Completa',
            'logo_color' => 'bg-indigo-100 text-indigo-700',
            'logo_initial' => 'D',
            'tags' => ['React', 'Node.js', 'TypeScript', 'AWS'],
            'verified' => true,
            'fast_apply' => true,
            'description' => 'Desarrollo y diseño de soluciones escalables en React y TypeScript sobre infraestructura AWS.',
        ]);

        JobListing::create([
            'user_id' => $user->id,
            'title' => 'Product Designer UI/UX',
            'company_name' => 'FinNova Bank',
            'location' => 'Híbrido Madrid',
            'salary' => '42K - 52K €',
            'type' => 'Jornada Completa',
            'modality' => 'Híbrido',
            'jornada' => 'Completa',
            'logo_color' => 'bg-green-100 text-green-700',
            'logo_initial' => 'F',
            'tags' => ['Figma', 'Design Systems', 'Mobile Apps'],
            'badge' => 'Destacada',
            'verified' => false,
            'fast_apply' => false,
            'description' => 'Lidera la experiencia de usuario y sistemas de diseño para banca móvil innovadora.',
        ]);

        JobListing::create([
            'user_id' => $user->id,
            'title' => 'Data Analyst / BI Specialist',
            'company_name' => 'Logistics Hub',
            'location' => 'Presencial Valencia',
            'salary' => '35K - 40K €',
            'type' => 'Jornada Completa',
            'modality' => 'Presencial',
            'jornada' => 'Completa',
            'logo_color' => 'bg-blue-100 text-blue-700',
            'logo_initial' => 'L',
            'tags' => ['Python', 'SQL', 'PowerBI'],
            'verified' => false,
            'fast_apply' => false,
            'description' => 'Modelado de datos, reporting y análisis estratégico en PowerBI y SQL.',
        ]);

        JobListing::create([
            'user_id' => $user->id,
            'title' => 'Growth Marketing Lead',
            'company_name' => 'SaaS Scale',
            'location' => '100% Remoto',
            'salary' => '40K - 50K €',
            'type' => 'Jornada Completa',
            'modality' => '100% Remoto',
            'jornada' => 'Completa',
            'logo_color' => 'bg-orange-100 text-orange-700',
            'logo_initial' => 'S',
            'tags' => ['B2B SaaS', 'Paid Media', 'HubSpot'],
            'verified' => false,
            'fast_apply' => false,
            'description' => 'Estrategia de captación digital y optimización de embudos en B2B SaaS.',
        ]);

        // ── 3. Empleo Público (Convocatorias) ──────────────────────────────────
        PublicJob::truncate();
        PublicJob::create([
            'status' => 'urgente',
            'status_label' => '⚡ Gestión — ¡dias cierre 24 hs!',
            'subgrupo' => 'A2',
            'subgrupo_color' => 'text-blue-700 bg-blue-50',
            'title' => 'Técnico/a de Gestión de Sistemas e Informática',
            'organismo' => 'Administración General del Estado (AGE) · Ministerio para la Transformación Digital',
            'plazas' => 450,
            'requisito' => 'Grado / Diplomatura',
            'regimen' => 'Funcionario de Carrera · Oposición libre pura',
            'cta_label' => 'Ver bases en BOE',
            'cta_variant' => 'primary',
            'ambit' => 'Estado (AGE)',
        ]);

        PublicJob::create([
            'status' => 'abierto',
            'status_label' => 'Plazo abierto (34 días restantes)',
            'subgrupo' => 'C1',
            'subgrupo_color' => 'text-amber-700 bg-amber-50',
            'title' => 'Cuerpo Básico de la Seguridad Social',
            'organismo' => 'Instituto Nacional de la Seguridad Social (INSS)',
            'plazas' => 1200,
            'requisito' => 'Bachillerato o Técnico',
            'regimen' => 'Oposición libre nacional de libre mérito',
            'cta_label' => 'Consultar BOE Oficial',
            'cta_variant' => 'warning',
            'extra_info' => 'Acceso: Bachillerato o Técnico',
            'ambit' => 'Estado (AGE)',
        ]);

        PublicJob::create([
            'status' => 'listas',
            'status_label' => 'Listas provisionales de admisión',
            'subgrupo' => 'A2',
            'subgrupo_color' => 'text-green-700 bg-green-50',
            'ambit' => 'Sanitario',
            'title' => 'Enfermero/a del Servicio de Salud Autonómico',
            'organismo' => 'Servicios Sanitarios Regionales · Bolsas de empleo y estabilización',
            'plazas' => 850,
            'requisito' => 'Diplomatura / Grado en Enfermería',
            'regimen' => 'Concurso-Oposición',
            'sistema' => '850 estatutarios',
            'cta_label' => 'Revisar Listas y Subsanar',
            'cta_variant' => 'success',
        ]);

        PublicJob::create([
            'status' => 'proximamente',
            'status_label' => 'Próxima apertura (BOPV)',
            'subgrupo' => 'A2',
            'subgrupo_color' => 'text-gray-600 bg-gray-100',
            'ambit' => 'Local',
            'title' => 'Arquitecto/a o Técnico Municipal',
            'organismo' => 'Ayuntamiento de Valencia · Urbanismo y Obras',
            'plazas' => 12,
            'requisito' => 'Arquitectura / Ingeniería Técnica',
            'regimen' => 'Turno Libre',
            'cta_label' => 'Avisarme al abrir plazo',
            'cta_variant' => 'ghost',
        ]);

        // ── 4. Cursos y Certificaciones ───────────────────────────────────────
        Course::truncate();
        Course::create([
            'badge' => 'gratis',
            'badge_label' => '✅ Subvencionado Fondos UE [Gratis]',
            'title' => 'Certificación Cloud Practitioner & DevOps Essentials',
            'horas' => '60h lectivas',
            'nivel' => 'Nivel Intermedio',
            'modalidad' => 'Online flexible',
            'area' => 'Tecnología & IA',
            'extras' => ['Insignia Digital Blockchain'],
            'rating' => 4.9,
            'rating_count' => 420,
            'precio' => '100% Gratuito',
            'cta_label' => 'Inscribirme',
            'cta_variant' => 'primary',
        ]);

        Course::create([
            'badge' => 'ocupados',
            'badge_label' => '👤 Para ocupados y desempleados',
            'title' => 'Inglés Profesional C1 para Entrevistas IT y Negocios',
            'horas' => '45h lectivas',
            'nivel' => 'B2-C1',
            'modalidad' => 'Clases en vivo',
            'area' => 'Idiomas y Negocios',
            'extras' => ['Simulacros reales'],
            'precio' => 'Gratuito',
            'inicio' => 'Próximo lunes',
            'cta_label' => 'Ver Programa',
            'cta_variant' => 'secondary',
        ]);

        Course::create([
            'badge' => 'camara',
            'badge_label' => '🏛️ Avalado Cámara de Comercio',
            'title' => 'Especialista en Inteligencia Artificial Generativa aplicada a Negocio',
            'horas' => '80h formativas',
            'nivel' => 'Avanzado',
            'modalidad' => 'Online flexible',
            'area' => 'Tecnología & IA',
            'tags' => ['Prompt Engineering & LLMs'],
            'rating' => 4.8,
            'rating_count' => 310,
            'precio' => 'Consultar precio',
            'cta_label' => 'Consultar Plazas',
            'cta_variant' => 'outline',
        ]);

        Course::create([
            'badge' => 'internacional',
            'badge_label' => '🌍 Certificación Oficial Internacional',
            'title' => 'Scrum Master & Agile Leadership',
            'horas' => '30h intensivas',
            'nivel' => 'Todos los niveles',
            'modalidad' => 'Online + Examen',
            'area' => 'Gestión & Agile',
            'extras' => ['Examen de Certificación incluido'],
            'aprobados' => '98%',
            'precio' => 'Desde 299€',
            'cta_label' => 'Ver Detalles',
            'cta_variant' => 'outline',
        ]);

        // ── 5. Empresas, Insignias y Reseñas de Trabajadores ─────────────────
        CompanyReview::truncate();
        Company::truncate();

        // Empresa 1: NexTech Solutions
        $c1 = Company::create([
            'name' => 'NexTech Solutions',
            'sector' => 'Tecnología & Cloud',
            'size' => '250–500 emp.',
            'rating' => 4.8,
            'rating_count' => 312,
            'vacantes' => 14,
            'descripcion' => 'Autonomía real, sin microgestión y presupuesto ilimitado en formación y herramientas.',
            'logo_color' => 'bg-blue-100 text-blue-700',
            'logo_icon' => 'tech',
            'filter_tag' => 'Tecnología',
            'top_cultura_rank' => 1,
            'top_cultura_quote' => 'Autonomía real, sin microgestión y presupuesto ilimitado en...',
            'insignias_obtenidas' => ['ambiente', 'flexible', 'liderazgo', 'formacion', 'diversidad'],
        ]);

        CompanyReview::create([
            'company_id' => $c1->id,
            'autor' => 'Miguel R.',
            'cargo' => 'Senior Dev',
            'texto' => 'El mejor sitio donde he trabajado. Total autonomía y un equipo increíble.',
            'rating' => 5,
            'fecha' => 'Hace 2 días',
            'insignias_votadas' => ['ambiente', 'liderazgo', 'formacion'],
        ]);
        CompanyReview::create([
            'company_id' => $c1->id,
            'autor' => 'Sara L.',
            'cargo' => 'Cloud Architect',
            'texto' => 'Excelente ambiente y presupuesto real para formación sin burocracia.',
            'rating' => 5,
            'fecha' => 'Hace 1 semana',
            'insignias_votadas' => ['flexible', 'formacion', 'diversidad'],
        ]);

        // Empresa 2: Iberia Green Energy
        $c2 = Company::create([
            'name' => 'Iberia Green Energy',
            'sector' => 'Renewables & Tech',
            'size' => '50–250 emp.',
            'rating' => 4.6,
            'rating_count' => 189,
            'vacantes' => 8,
            'descripcion' => 'Cultura orientada a sostenibilidad y conciliación. 100% remoto con reuniones asíncronas.',
            'logo_color' => 'bg-green-100 text-green-700',
            'logo_icon' => 'green',
            'filter_tag' => 'Tecnología',
            'top_cultura_rank' => 2,
            'top_cultura_quote' => 'Jornada intensiva todo el año y propósito real en cada proyecto...',
            'insignias_obtenidas' => ['sostenible', 'remoto', 'conciliacion', 'flexible'],
        ]);

        CompanyReview::create([
            'company_id' => $c2->id,
            'autor' => 'Ana P.',
            'cargo' => 'DevOps Engineer',
            'texto' => 'Empresa con propósito real. Se nota que les importa el planeta y las personas.',
            'rating' => 5,
            'fecha' => 'Hace 3 días',
            'insignias_votadas' => ['sostenible', 'conciliacion'],
        ]);
        CompanyReview::create([
            'company_id' => $c2->id,
            'autor' => 'Carlos M.',
            'cargo' => 'Backend Dev',
            'texto' => '100% remoto real, no como en otras empresas donde te piden volver a la oficina.',
            'rating' => 4,
            'fecha' => 'Hace 2 semanas',
            'insignias_votadas' => ['remoto', 'flexible'],
        ]);

        // Empresa 3: BancNova Digital
        $c3 = Company::create([
            'name' => 'BancNova Digital',
            'sector' => 'Fintech Líder',
            'size' => '+1000 emp.',
            'rating' => 4.5,
            'rating_count' => 543,
            'vacantes' => 22,
            'descripcion' => 'Salarios certificados en el Top 10% del mercado con equity y plan de pensiones.',
            'logo_color' => 'bg-violet-100 text-violet-700',
            'logo_icon' => 'fintech',
            'filter_tag' => 'Fintech',
            'insignias_obtenidas' => ['salario', 'equity', 'liderazgo'],
        ]);

        CompanyReview::create([
            'company_id' => $c3->id,
            'autor' => 'Javier T.',
            'cargo' => 'Product Manager',
            'texto' => 'Los salarios son los mejores del sector. El equity plan es real y transparente.',
            'rating' => 4,
            'fecha' => 'Hace 5 días',
            'insignias_votadas' => ['salario', 'equity'],
        ]);

        // Empresa 4: BioHealth Pharma
        $c4 = Company::create([
            'name' => 'BioHealth Pharma',
            'sector' => 'Biomédico & R&D',
            'size' => '50–250 emp.',
            'rating' => 4.4,
            'rating_count' => 97,
            'vacantes' => 5,
            'descripcion' => 'Investigación clínica puntera e instalaciones de última generación en España.',
            'logo_color' => 'bg-red-100 text-red-700',
            'logo_icon' => 'pharma',
            'filter_tag' => 'Salud',
            'insignias_obtenidas' => ['conciliacion', 'ambiente'],
        ]);

        CompanyReview::create([
            'company_id' => $c4->id,
            'autor' => 'Laura G.',
            'cargo' => 'Investigadora',
            'texto' => 'Instalaciones de primer nivel y un equipo muy comprometido con la ciencia.',
            'rating' => 4,
            'fecha' => 'Hace 1 mes',
            'insignias_votadas' => ['ambiente', 'conciliacion'],
        ]);

        Schema::enableForeignKeyConstraints();
    }
}
