<?php

namespace App\Http\Controllers\Admin;

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VoterController extends Controller
{
    /**
     * Daftar seluruh voter.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');

        $query = User::query()
            ->where('role', 'voter')
            ->withSum('votes as total_votes', 'quantity')
            ->when($search, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $voters = $query
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($voter) {
                return [
                    'id' => $voter->id,
                    'name' => $voter->name,
                    'email' => $voter->email,
                    'photo_url' => $voter->profile_photo_path
                        ? asset('storage/' . $voter->profile_photo_path)
                        : null,
                    'created_at' => $voter->created_at,
                    'total_votes' => (int) ($voter->total_votes ?? 0),
                ];
            });

        return Inertia::render('admin/voters/index', [
            'voters' => $voters,
            'stats' => [
                'totalVoters' => User::where('role', 'voter')->count(),
                'totalVotesUsed' => (int) Vote::whereHas('user', function ($query) {
                    $query->where('role', 'voter');
                })->sum('quantity'),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Detail akun voter.
     */
    public function show(int $voter): Response
    {
        $voter = User::query()
            ->where('role', 'voter')
            ->withSum('votes as total_votes', 'quantity')
            ->withCount('votes')
            ->findOrFail($voter);

        return Inertia::render('admin/voters/show', [
            'voter' => [
                'id' => $voter->id,
                'name' => $voter->name,
                'email' => $voter->email,
                'photo_url' => $voter->profile_photo_path
                    ? asset('storage/' . $voter->profile_photo_path)
                    : null,
                'created_at' => $voter->created_at,
                'total_votes' => (int) ($voter->total_votes ?? 0),
                'total_transactions' => (int) $voter->votes_count,
            ],
        ]);
    }
}