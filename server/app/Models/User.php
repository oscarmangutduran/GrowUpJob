<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'role',
        'last_name',
        'headline',
        'phone',
        'location',
        'birthday',
        'avatar',
        'cv_path',
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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'disponible_remoto' => 'boolean',
            'preseleccionada_activa' => 'boolean',
            'match_global' => 'integer',
            'ofertas_hoy' => 'integer',
            'notificaciones' => 'boolean',
            'visibilidad_reclutadores' => 'boolean',
        ];
    }

    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(UserExperience::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(UserEducation::class);
    }

    public function languages(): HasMany
    {
        return $this->hasMany(UserLanguage::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(UserLink::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CompanyReview::class);
    }
}
