<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicJob extends Model
{
    protected $fillable = [
        'title',
        'organismo',
        'status',
        'status_label',
        'status_days',
        'subgrupo',
        'subgrupo_color',
        'ambit',
        'plazas',
        'requisito',
        'regimen',
        'sistema',
        'cta_label',
        'cta_variant',
        'extra_info',
        'boe_url',
    ];

    protected $casts = [
        'plazas' => 'integer',
    ];
}
