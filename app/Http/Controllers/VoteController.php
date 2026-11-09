<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use App\Models\Vote;
use App\Models\VotingPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VoteController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'member_id' => ['required', 'integer', 'exists:members,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $userId = Auth::id();

        if (!$userId) {
            return redirect()
                ->route('login')
                ->with('error', 'Silakan login terlebih dahulu.');
        }

        DB::transaction(function () use ($validated, $userId) {
            $user = User::whereKey($userId)
                ->lockForUpdate()
                ->firstOrFail();

            $period = VotingPeriod::where('status', 'published')
                ->where('start_at', '<=', now())
                ->where('end_at', '>=', now())
                ->lockForUpdate()
                ->first();

            if (!$period) {
                throw ValidationException::withMessages([
                    'voting_period_id' => 'Saat ini tidak ada periode voting yang aktif.',
                ]);
            }

            if (!$period->isVotingOpen()) {
                throw ValidationException::withMessages([
                    'voting_period_id' => 'Periode voting sudah ditutup.',
                ]);
            }

            $member = Member::whereKey($validated['member_id'])
                ->where('is_active', true)
                ->first();

            if (!$member) {
                throw ValidationException::withMessages([
                    'member_id' => 'Member tidak aktif atau tidak ditemukan.',
                ]);
            }

            $usedVotes = Vote::where('user_id', $user->id)
                ->where('voting_period_id', $period->id)
                ->sum('quantity');

            $remainingQuota = $period->votes_per_voter - $usedVotes;

            if ($remainingQuota <= 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Kuota voting kamu sudah habis.',
                ]);
            }

            if ($validated['quantity'] > $remainingQuota) {
                throw ValidationException::withMessages([
                    'quantity' => "Sisa kuota voting kamu hanya {$remainingQuota} suara.",
                ]);
            }

            Vote::create([
                'user_id' => $user->id,
                'member_id' => $member->id,
                'voting_period_id' => $period->id,
                'quantity' => $validated['quantity'],
            ]);
        });

        return back()->with('success', 'Vote berhasil disimpan!');
    }
}