<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserExperience extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'company',
        'org',
        'period',
        'desc',
        'tags',
        'current',
    ];

    protected $casts = [
        'tags' => 'array',
        'current' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
