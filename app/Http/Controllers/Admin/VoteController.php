<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        $periodId = $request->query('period_id');

        $query = Vote::query()
            ->with([
                'member:id,name,photo_path,team',
                'votingPeriod:id,name',
            ])
            ->when($search, function ($query, $search) {
                $query->whereHas('member', function ($memberQuery) use ($search) {
                    $memberQuery->where('name', 'like', "%{$search}%");
                });
            })
            ->when($periodId, function ($query, $periodId) {
                $query->where('voting_period_id', $periodId);
            });

        $totalVotes = (clone $query)->sum('quantity');
        $totalTransactions = (clone $query)->count();

        $votes = $query
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($vote) {
                return [
                    'id' => $vote->id,
                    'member_name' => $vote->member?->name ?? 'Member tidak ditemukan',
                    'member_photo' => $vote->member?->photo_url,
                    'member_team' => $vote->member?->team,
                    'period_name' => $vote->votingPeriod?->name ?? 'Periode tidak ditemukan',
                    'quantity' => (int) $vote->quantity,
                    'created_at' => $vote->created_at,
                ];
            });

        return Inertia::render('admin/votes/index', [
            'votes' => $votes,
            'periods' => VotingPeriod::orderByDesc('start_at')
                ->get(['id', 'name']),
            'stats' => [
                'totalVotes' => (int) $totalVotes,
                'totalTransactions' => $totalTransactions,
            ],
            'filters' => [
                'search' => $search,
                'period_id' => $periodId,
            ],
        ]);
    }
}