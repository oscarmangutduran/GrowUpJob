<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'badge',
        'badge_label',
        'horas',
        'nivel',
        'modalidad',
        'area',
        'extras',
        'tags',
        'rating',
        'rating_count',
        'precio',
        'precio_label',
        'inicio',
        'aprobados',
        'cta_label',
        'cta_variant',
    ];

    protected $casts = [
        'extras' => 'array',
        'tags' => 'array',
        'rating' => 'float',
        'rating_count' => 'integer',
    ];
}
