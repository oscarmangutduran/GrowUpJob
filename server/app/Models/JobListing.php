<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    ];

    /**
     * Get the user/company that owns this listing.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
