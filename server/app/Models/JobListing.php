<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobListing extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'company_name',
        'description',
        'location',
        'salary',
        'type',
        'modality',
        'jornada',
        'tags',
        'verified',
        'badge',
        'fast_apply',
        'logo_color',
        'logo_initial',
        'salary_color',
    ];

    protected $casts = [
        'tags' => 'array',
        'verified' => 'boolean',
        'fast_apply' => 'boolean',
    ];

    /**
     * Get the user/company that owns this listing.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Applications for this job listing.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
