<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VotingPeriod extends Model
{
    protected $fillable = [
        'name',
        'description',
        'start_at',
        'end_at',
        'votes_per_voter',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'votes_per_voter' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function isVotingOpen(): bool
    {
        return $this->status === 'published'
            && now()->greaterThanOrEqualTo($this->start_at)
            && now()->lessThanOrEqualTo($this->end_at);
    }

    public function votes(): HasMany
{
    return $this->hasMany(Vote::class);
}
}