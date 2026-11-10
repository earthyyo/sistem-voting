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

    // PERIODE VOTING YANG SEDANG BERLANGSUNG
    $activePeriod = VotingPeriod::query()
        ->where('status', 'published')
        ->where('start_at', '<=', $now)
        ->where('end_at', '>=', $now)
        ->orderBy('start_at')
        ->first();

    // PERIODE TERAKHIR YANG SUDAH SELESAI
    $lastCompletedPeriod = VotingPeriod::query()
        ->where('status', '!=', 'draft')
        ->where('end_at', '<=', $now)
        ->orderByDesc('end_at')
        ->first();

    // FINAL SENBATSU RANKING 1-12
    $finalSenbatsu = collect();

    if ($lastCompletedPeriod) {
        $finalSenbatsu = Member::query()
            ->whereHas('votes', function ($query) use ($lastCompletedPeriod) {
                $query->where(
                    'voting_period_id',
                    $lastCompletedPeriod->id
                );
            })
            ->withSum([
                'votes as total_votes' => function ($query) use ($lastCompletedPeriod) {
                    $query->where(
                        'voting_period_id',
                        $lastCompletedPeriod->id
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

  
    // MEMBER PREVIEW: SATU MEMBER SETIAP TEAM
    $teams = ['Love', 'Dream', 'Passion'];

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

    // KIRIM DATA KE HALAMAN HOME
    return Inertia::render('home', [
        'featuredMembers' => $featuredMembers,

        'activePeriod' => $activePeriod ? [
            'id' => $activePeriod->id,
            'name' => $activePeriod->name,
            'start_at' => $activePeriod->start_at,
            'end_at' => $activePeriod->end_at,
            'status' => $activePeriod->status,
        ] : null,

        'finalSenbatsuPeriod' => $lastCompletedPeriod ? [
            'id' => $lastCompletedPeriod->id,
            'name' => $lastCompletedPeriod->name,
            'end_at' => $lastCompletedPeriod->end_at,
        ] : null,

        'finalSenbatsu' => $finalSenbatsu,

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

    // Total seluruh vote voter dari semua periode
$totalVotes = Vote::where('user_id', $user->id)
    ->sum('quantity');

// Sisa kuota hanya untuk periode yang sedang berlangsung
$remainingQuota = 0;

if ($activePeriod) {
    $votesUsedInActivePeriod = Vote::where('user_id', $user->id)
        ->where('voting_period_id', $activePeriod->id)
        ->sum('quantity');

    $remainingQuota = max(
        0,
        $activePeriod->votes_per_voter - $votesUsedInActivePeriod
    );
}
    // Periode terakhir yang hasilnya sudah diumumkan
   $previousPeriod = VotingPeriod::query()
    ->where('status', '!=', 'draft')
    ->where('end_at', '<=', now())
    ->orderByDesc('end_at')
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

   public function members(): Response
{
    $userId = Auth::id();

    // Periode voting yang sedang berlangsung
    $activePeriod = VotingPeriod::query()
        ->where('status', 'published')
        ->where('start_at', '<=', now())
        ->where('end_at', '>=', now())
        ->first();

    $votesUsed = 0;
    $votesRemaining = 0;

    // Hitung kuota hanya jika user sudah login
    // dan periode voting sedang berlangsung
    if ($activePeriod && $userId) {
        $votesUsed = Vote::query()
            ->where('user_id', $userId)
            ->where('voting_period_id', $activePeriod->id)
            ->sum('quantity');

        $votesRemaining = max(
            0,
            $activePeriod->votes_per_voter - $votesUsed
        );
    }

    // Ambil seluruh member aktif
    $members = Member::query()
        ->where('is_active', true)
        ->orderBy('name')
        ->get()
        ->map(fn ($member) => [
            'id' => $member->id,
            'name' => $member->name,
            'description' => $member->description,
            'birth_place' => $member->birth_place,
            'birth_date' => $member->birth_date,
            'generation' => $member->generation,
            'team' => $member->team,
            'photo_url' => $member->photo_url,
        ]);

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
    // Ambil semua periode yang sudah selesai
    $completedPeriods = VotingPeriod::query()
        ->where('status', '!=', 'draft')
        ->where('end_at', '<=', now())
        ->orderByDesc('end_at')
        ->get([
            'id',
            'name',
            'start_at',
            'end_at',
            'status',
        ]);

    // Pilih periode berdasarkan parameter URL
    $selectedPeriod = $completedPeriods->firstWhere(
        'id',
        (int) $request->query('period')
    );

    // Jika belum memilih, gunakan periode terbaru
    if (! $selectedPeriod) {
        $selectedPeriod = $completedPeriods->first();
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
                'total_votes' => (int) ($member->total_votes ?? 0),
                'rank' => $index + 1,
            ]);
    }

    return Inertia::render('voter/ranking', [
        'announcedPeriods' => $completedPeriods,
        'selectedPeriod' => $selectedPeriod,
        'ranking' => $ranking,
    ]);
}

    // ========================================
    // RIWAYAT VOTE VOTER
    // ========================================

public function history(): Response
{
    $periods = VotingPeriod::query()
        ->where('status', '!=', 'draft')
        ->where('end_at', '<=', now())
        ->withSum('votes as total_votes', 'quantity')
        ->orderByDesc('end_at')
        ->get()
        ->map(fn ($period) => [
            'id' => $period->id,
            'name' => $period->name,
            'start_at' => $period->start_at,
            'end_at' => $period->end_at,
            'total_votes' => (int) ($period->total_votes ?? 0),
        ]);

    return Inertia::render('voter/history', [
        'periods' => $periods,
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