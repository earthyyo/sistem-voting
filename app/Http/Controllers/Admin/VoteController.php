<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Vote;
use App\Models\VotingPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $now = now();

        // Ambil periode yang sedang berlangsung atau sudah selesai.
        $periods = VotingPeriod::query()
            ->where(function ($query) use ($now) {
                // Periode yang sedang berlangsung.
                $query->where(function ($subQuery) use ($now) {
                    $subQuery->where('status', 'published')
                        ->where('start_at', '<=', $now)
                        ->where('end_at', '>=', $now);
                })

                // Periode yang sudah selesai.
                ->orWhere(function ($subQuery) use ($now) {
                    $subQuery->where('status', '!=', 'draft')
                        ->where(function ($endQuery) use ($now) {
                            $endQuery->where('status', 'closed')
                                ->orWhere('end_at', '<', $now);
                        });
                });
            })
            ->orderByDesc('start_at')
            ->get(['id', 'name', 'status', 'start_at', 'end_at']);

        // Periode yang dipilih dari filter.
        $periodId = $request->query('period_id');

        // Jika belum memilih periode, gunakan periode aktif.
        if (!$periodId) {
            $selectedPeriod = $periods->first(function ($period) use ($now) {
                return $period->status === 'published'
                    && $period->start_at <= $now
                    && $period->end_at >= $now;
            });

            // Jika tidak ada periode aktif, gunakan periode terbaru.
            $selectedPeriod ??= $periods->first();

            $periodId = $selectedPeriod?->id;
        } else {
            $selectedPeriod = $periods->firstWhere(
                'id',
                (int) $periodId
            );

            // Jika periode tidak termasuk pilihan yang tersedia,
            // gunakan periode terbaru.
            if (!$selectedPeriod) {
                $selectedPeriod = $periods->first();
                $periodId = $selectedPeriod?->id;
            }
        }

        // Ambil member dan jumlah seluruh suara yang diterimanya
        // pada periode yang sedang dipilih.
        $membersQuery = Member::query()
            ->whereHas('votes', function ($query) use ($periodId) {
                $query->where('voting_period_id', $periodId);
            })
            ->withSum([
                'votes as total_votes' => function ($query) use ($periodId) {
                    $query->where('voting_period_id', $periodId);
                },
            ], 'quantity')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            });

        // Total suara mengikuti periode dan pencarian.
        $totalVotes = Vote::query()
            ->where('voting_period_id', $periodId)
            ->when($search, function ($query, $search) {
                $query->whereHas('member', function ($memberQuery) use ($search) {
                    $memberQuery->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );
                });
            })
            ->sum('quantity');

        // Satu member hanya tampil satu kali.
        $votes = $membersQuery
            ->orderByDesc('total_votes')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($member) use ($selectedPeriod) {
                return [
                    'id' => $member->id,
                    'member_name' => $member->name,
                    'member_photo' => $member->photo_url,
                    'member_team' => $member->team,
                    'period_name' => $selectedPeriod?->name,
                    'quantity' => (int) ($member->total_votes ?? 0),
                ];
            });

        return Inertia::render('admin/votes/index', [
            'votes' => $votes,
            'periods' => $periods->map(fn ($period) => [
                'id' => $period->id,
                'name' => $period->name,
                'status' => $period->status,
            ]),
            'stats' => [
                'totalVotes' => (int) $totalVotes,
            ],
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
            ],
        ]);
    }
}