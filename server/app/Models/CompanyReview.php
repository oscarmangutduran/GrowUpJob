<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyReview extends Model
{
    protected $fillable = [
        'company_id',
        'user_id',
        'autor',
        'cargo',
        'texto',
        'rating',
        'fecha',
        'insignias_votadas',
    ];

    protected $casts = [
        'rating' => 'integer',
        'insignias_votadas' => 'array',
    ];

    /**
     * Company that this review belongs to.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Worker user that wrote this review (if logged in).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
