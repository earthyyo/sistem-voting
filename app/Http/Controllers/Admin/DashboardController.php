<?php

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
                ->count(),

            'closed' => VotingPeriod::where('status', 'closed')
                ->count(),

            'ongoing' => VotingPeriod::where('status', 'published')
                ->where('start_at', '<=', $now)
                ->where('end_at', '>=', $now)
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
            ->map(fn (VotingPeriod $period) => [
                'id' => $period->id,
                'name' => $period->name,
                'start_at' => $period->start_at?->format('d M Y H:i'),
                'end_at' => $period->end_at?->format('d M Y H:i'),
                'status' => $period->status,
            ]);

        // Statistik utama dashboard admin
        $stats = [
            // Total seluruh member
            'members' => Member::count(),

            // Total member aktif
            'active_members' => Member::where('is_active', true)
                ->count(),

            // Total akun voter
            'voters' => User::where('role', 'voter')
                ->count(),

            // Total suara sebenarnya berdasarkan quantity
            'votes' => Vote::sum('quantity'),

            // Statistik periode
            'periods' => $periodStats,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentPeriods' => $recentPeriods,
        ]);
    }
}