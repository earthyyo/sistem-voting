<?php

namespace App\Http\Controllers\Admin;

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use App\Models\Vote;
use App\Models\VotingPeriod;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();

        // Statistik periode voting
        $periodStats = [
            'total' => VotingPeriod::count(),

            'draft' => VotingPeriod::where('status', 'draft')
                ->count(),

            'published' => VotingPeriod::where('status', 'published')
                ->where('end_at', '>', $now)
                ->count(),

            'completed' => VotingPeriod::where(function ($query) use ($now) {
                $query->where('status', 'closed')
                    ->orWhere(function ($q) use ($now) {
                        $q->where('status', 'published')
                            ->where('end_at', '<=', $now);
                    });
            })->count(),

            'ongoing' => VotingPeriod::where('status', 'published')
                ->where('start_at', '<=', $now)
                ->where('end_at', '>', $now)
                ->count(),
        ];

        // Lima periode terbaru
        $recentPeriods = VotingPeriod::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get([
                'id',
                'name',
                'start_at',
                'end_at',
                'status',
            ])
            ->map(function (VotingPeriod $period) use ($now) {
                // Tentukan status yang ditampilkan
                if ($period->status === 'draft') {
                    $status = 'draft';
                } elseif (
                    $period->status === 'closed' ||
                    $period->end_at->lessThanOrEqualTo($now)
                ) {
                    $status = 'selesai';
                } else {
                    $status = 'published';
                }

                return [
                    'id' => $period->id,
                    'name' => $period->name,
                    'start_at' => $period->start_at?->format('d M Y H:i'),
                    'end_at' => $period->end_at?->format('d M Y H:i'),
                    'status' => $status,
                ];
            });

        // Statistik utama dashboard admin
        $stats = [
            'members' => Member::count(),

            'active_members' => Member::where('is_active', true)
                ->count(),

            'voters' => User::where('role', 'voter')
                ->count(),

            'votes' => Vote::sum('quantity'),

            'periods' => $periodStats,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentPeriods' => $recentPeriods,
        ]);
    }
}