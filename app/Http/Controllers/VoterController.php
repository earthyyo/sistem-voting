<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Vote;
use App\Models\User;
use App\Models\VotingPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class VoterController extends Controller
{
    // ========================================
    // HALAMAN HOME
    // ========================================

    public function home(): Response
    {
        $now = now();

        $activePeriod = VotingPeriod::query()
            ->where('status', 'published')
            ->where('start_at', '<=', $now)
            ->where('end_at', '>=', $now)
            ->orderBy('start_at')
            ->first();

        $teams = ['Love', 'Dream', 'Passion'];

        // Member unggulan tanpa menampilkan total suara.
        $featuredMembers = collect($teams)
            ->map(function ($team) {
                $member = Member::query()
                    ->where('is_active', true)
                    ->where('team', $team)
                    ->orderBy('name')
                    ->first();

                if (! $member) {
                    return null;
                }

                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'team' => $member->team,
                    'generation' => $member->generation,
                    'photo_url' => $member->photo_url,
                ];
            })
            ->filter()
            ->values();

        return Inertia::render('home', [
            'featuredMembers' => $featuredMembers,

            'activePeriod' => $activePeriod ? [
                'id' => $activePeriod->id,
                'name' => $activePeriod->name,
                'start_at' => $activePeriod->start_at,
                'end_at' => $activePeriod->end_at,
                'status' => $activePeriod->status,
            ] : null,

            'isAuthenticated' => Auth::check(),
        ]);
    }


    // ========================================
    // DASHBOARD VOTER
    // ========================================

   
public function dashboard()
{
    $user = User::findOrFail(Auth::id());

    // Periode voting yang sedang berlangsung
    $activePeriod = VotingPeriod::where('status', 'published')
        ->where('start_at', '<=', now())
        ->where('end_at', '>=', now())
        ->first();

    // Statistik voting voter
    $totalVotes = 0;
    $remainingQuota = 0;

    if ($activePeriod) {
        $totalVotes = Vote::where('user_id', $user->id)
            ->where('voting_period_id', $activePeriod->id)
            ->sum('quantity');

        $remainingQuota = max(
            0,
            $activePeriod->votes_per_voter - $totalVotes
        );
    }

    // Periode terakhir yang hasilnya sudah diumumkan
    $previousPeriod = VotingPeriod::whereNotNull('results_announced_at')
        ->orderByDesc('results_announced_at')
        ->first();

    // Ranking member periode sebelumnya
    $previousRanking = collect();

    if ($previousPeriod) {
        $previousRanking = Member::whereHas('votes', function ($query) use ($previousPeriod) {
            $query->where('voting_period_id', $previousPeriod->id);
        })
            ->withSum([
                'votes as total_votes' => function ($query) use ($previousPeriod) {
                    $query->where('voting_period_id', $previousPeriod->id);
                },
            ], 'quantity')
            ->orderByDesc('total_votes')
            ->take(12)
            ->get();
    }

    // Data profil voter beserta URL foto profil
    $authUser = [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'photo_url' => $user->profile_photo_path
            ? asset('storage/' . $user->profile_photo_path)
            : null,
    ];

    return Inertia::render('voter/dashboard', [
        'authUser' => $authUser,
        'activePeriod' => $activePeriod,
        'stats' => [
            'totalVotes' => $totalVotes,
            'remainingQuota' => $remainingQuota,
            'targetSenbatsu' => 12,
        ],
        'previousPeriod' => $previousPeriod,
        'previousRanking' => $previousRanking,
    ]);
}

    // ========================================
    // DAFTAR MEMBER UNTUK VOTER
    // ========================================

    public function members()
{
    $activePeriod = VotingPeriod::where('status', 'published')
        ->where('start_at', '<=', now())
        ->where('end_at', '>=', now())
        ->first();

    $votesUsed = 0;
    $votesRemaining = 0;

    if ($activePeriod) {
        $votesUsed = Vote::where('user_id', Auth::id())
            ->where('voting_period_id', $activePeriod->id)
            ->sum('quantity');

        $votesRemaining = max(
            0,
            $activePeriod->votes_per_voter - $votesUsed
        );
    }

    // Ambil member aktif dari database
    $members = Member::where('is_active', true)
        ->orderBy('name')
        ->get()
        ->map(function ($member) {
            $member->photo_url = $member->photo
                ? asset('storage/' . $member->photo)
                : null;

            return $member;
        });

    return Inertia::render('voter/members', [
        'members' => $members,
        'activePeriod' => $activePeriod,
        'votesUsed' => $votesUsed,
        'votesRemaining' => $votesRemaining,
        'isAuthenticated' => Auth::check(),
    ]);
}

    // ========================================
    // RANKING MEMBER
    // HANYA PERIODE YANG SUDAH DIUMUMKAN
    // ========================================

    
public function ranking(Request $request): Response
{
    $announcedPeriods = VotingPeriod::query()
        ->whereNotNull('results_announced_at')
        ->orderByDesc('results_announced_at')
        ->get([
            'id',
            'name',
            'start_at',
            'end_at',
            'results_announced_at',
        ]);

    $selectedPeriod = $announcedPeriods->firstWhere(
        'id',
        (int) $request->query('period')
    );

    if (!$selectedPeriod) {
        $selectedPeriod = $announcedPeriods->first();
    }

    $ranking = collect();

    if ($selectedPeriod) {
        $ranking = Member::query()
            ->where('is_active', true)
            ->withSum([
                'votes as total_votes' => function ($query) use ($selectedPeriod) {
                    $query->where(
                        'voting_period_id',
                        $selectedPeriod->id
                    );
                },
            ], 'quantity')
            ->orderByDesc('total_votes')
            ->orderBy('name')
            ->limit(12)
            ->get()
            ->values()
            ->map(fn ($member, $index) => [
                'id' => $member->id,
                'name' => $member->name,
                'team' => $member->team,
                'generation' => $member->generation,
                'photo_url' => $member->photo_url,
                'total_votes' => (int) $member->total_votes,
                'rank' => $index + 1,
            ]);
    }

    return Inertia::render('voter/ranking', [
        'announcedPeriods' => $announcedPeriods,
        'selectedPeriod' => $selectedPeriod,
        'ranking' => $ranking,
    ]);
}


    // ========================================
    // RIWAYAT VOTE VOTER
    // ========================================

    

public function history(): Response
{
    $votes = Vote::with(['member', 'votingPeriod'])
        ->where('user_id', Auth::id())
        ->orderByDesc('created_at')
        ->get();

    $history = $votes
        ->groupBy('voting_period_id')
        ->map(function ($periodVotes) {
            $period = $periodVotes->first()->votingPeriod;

            $members = $periodVotes
                ->groupBy('member_id')
                ->map(function ($memberVotes) {
                    $firstVote = $memberVotes->first();

                    return [
                        'member_id' => $firstVote->member_id,
                        'member_name' => $firstVote->member?->name,
                        'member_photo' => $firstVote->member?->photo_url,
                        'member_team' => $firstVote->member?->team,
                        'quantity' => (int) $memberVotes->sum('quantity'),
                    ];
                })
                ->values();

            return [
                'period_id' => $period?->id,
                'period_name' => $period?->name ?? 'Periode tidak diketahui',
                'start_at' => $period?->start_at,
                'end_at' => $period?->end_at,
                'total_votes' => (int) $members->sum('quantity'),
                'members' => $members,
            ];
        })
        ->values();

    return Inertia::render('voter/history', [
        'history' => $history,
    ]);
}
    // ========================================
    // PROFIL VOTER
    // ========================================

    public function profile(): Response
    {
        $user = User::query()->findOrFail(Auth::id());

        return Inertia::render('voter/profile', [
            'authUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,

                'photo_url' => $user->profile_photo_path
                    ? asset('storage/' . $user->profile_photo_path)
                    : null,

                'created_at' => $user->created_at?->toDateTimeString(),
            ],
        ]);
    }


    // ========================================
    // UPDATE FOTO PROFIL
    // ========================================

    public function updateProfilePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => [
                'required',
                File::image()->max(2 * 1024),
            ],
        ], [
            'photo.required' => 'Pilih foto profil terlebih dahulu.',
            'photo.image' => 'File harus berupa gambar.',
            'photo.max' => 'Ukuran foto maksimal 2 MB.',
        ]);

        $user = User::query()->findOrFail(Auth::id());

        $oldPhoto = $user->profile_photo_path;

        $path = $request->file('photo')
            ->store('profile-photos', 'public');

        $user->profile_photo_path = $path;
        $user->save();

        if ($oldPhoto && $oldPhoto !== $path) {
            Storage::disk('public')->delete($oldPhoto);
        }

        return redirect()->route('profile')
            ->with('success', 'Foto profil berhasil diperbarui!');
    }

     // ========================================
    // UPDATE NAMA PROFILE
    // ========================================

    public function updateProfile(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
    ]);

    $user = User::findOrFail(Auth::id());

    $user->name = $validated['name'];
    $user->save();

    return redirect()
        ->route('profile')
        ->with('success', 'Nama profil berhasil diperbarui.');
}

// ========================================
    // UBAH PASSWORD
    // ========================================

    public function updatePassword(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'current_password' => ['required', 'current_password'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ], [
        'current_password.current_password' => 'Password lama tidak sesuai.',
        'password.min' => 'Password baru minimal 8 karakter.',
        'password.confirmed' => 'Konfirmasi password tidak cocok.',
    ]);

    $user = User::findOrFail(Auth::id());

    $user->password = $validated['password'];
    $user->save();

    return redirect()
        ->route('profile')
        ->with('success', 'Password berhasil diperbarui.');
}

}