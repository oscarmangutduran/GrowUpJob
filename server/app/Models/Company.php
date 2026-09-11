<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'sector',
        'size',
        'rating',
        'rating_count',
        'vacantes',
        'descripcion',
        'logo_color',
        'logo_icon',
        'filter_tag',
        'top_cultura_rank',
        'top_cultura_quote',
        'insignias_obtenidas',
    ];

    protected $casts = [
        'rating' => 'float',
        'rating_count' => 'integer',
        'vacantes' => 'integer',
        'top_cultura_rank' => 'integer',
        'insignias_obtenidas' => 'array',
    ];

    /**
     * User account associated with company.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Reviews left by candidates / workers.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(CompanyReview::class);
    }

    /**
     * Recalculate average rating and worker-voted insignias from reviews.
     */
    public function recalculateRatingAndInsignias(): void
    {
        $reviews = $this->reviews()->get();
        if ($reviews->isEmpty()) {
            return;
        }

        $avgRating = round($reviews->avg('rating'), 1);
        $count = $reviews->count();

        // Tally votes for each insignia
        $badgeVotes = [];
        foreach ($reviews as $rev) {
            $voted = is_array($rev->insignias_votadas) ? $rev->insignias_votadas : [];
            foreach ($voted as $badge) {
                $badgeVotes[$badge] = ($badgeVotes[$badge] ?? 0) + 1;
            }
        }

        // Badges that received votes from workers
        // Award badge if it has at least 1 vote from workers
        $currentInsignias = is_array($this->insignias_obtenidas) ? $this->insignias_obtenidas : [];
        $earnedBadges = array_unique(array_merge($currentInsignias, array_keys($badgeVotes)));

        $this->update([
            'rating' => $avgRating,
            'rating_count' => $count,
            'insignias_obtenidas' => array_values($earnedBadges),
        ]);
    }
}
