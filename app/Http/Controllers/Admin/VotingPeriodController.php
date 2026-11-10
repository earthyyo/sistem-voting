<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VotingPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VotingPeriodController extends Controller
{
    // Status yang bisa dipilih oleh admin
    private const STATUSES = ['published', 'private'];

    /**
     * Menampilkan daftar periode voting.
     */
    public function index(): Response
    {
        $periods = VotingPeriod::query()
            ->orderByDesc('start_at')
            ->paginate(10)
            ->withQueryString()
            ->through(function (VotingPeriod $period) {
                // Status selesai ditentukan otomatis berdasarkan end_at.
                if (
                    $period->status === 'published' &&
                    $period->end_at->lessThanOrEqualTo(now())
                ) {
                    $displayStatus = 'selesai';
                } elseif ($period->status === 'published') {
                    $displayStatus = 'published';
                } else {
                    // Status lama draft/closed juga ditampilkan sebagai private.
                    $displayStatus = 'private';
                }

                return [
                    'id' => $period->id,
                    'name' => $period->name,
                    'description' => $period->description,
                    'start_at' => $period->start_at->format('Y-m-d\TH:i'),
                    'end_at' => $period->end_at->format('Y-m-d\TH:i'),
                    'votes_per_voter' => $period->votes_per_voter,
                    'status' => $displayStatus,
                    'is_voting_open' => $period->isVotingOpen(),
                ];
            });

        return Inertia::render('admin/periods/index', [
            'periods' => $periods,
        ]);
    }

    /**
     * Form tambah periode.
     */
    public function create(): Response
    {
        return Inertia::render('admin/periods/form', [
            'period' => null,
            'statuses' => self::STATUSES,
        ]);
    }

    /**
     * Menyimpan periode baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:5000'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'votes_per_voter' => ['required', 'integer', 'min:1', 'max:1000'],
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        VotingPeriod::create($validated);

        return to_route('admin.periods.index')
            ->with('success', 'Periode voting berhasil dibuat.');
    }

    /**
     * Form edit periode.
     */
    public function edit(VotingPeriod $period): Response
    {
        return Inertia::render('admin/periods/form', [
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'description' => $period->description,
                'start_at' => $period->start_at->format('Y-m-d\TH:i'),
                'end_at' => $period->end_at->format('Y-m-d\TH:i'),
                'votes_per_voter' => $period->votes_per_voter,

                // Normalisasi status lama.
                'status' => $period->status === 'published'
                    ? 'published'
                    : 'private',
            ],
            'statuses' => self::STATUSES,
        ]);
    }

    /**
     * Memperbarui periode.
     */
    public function update(
        Request $request,
        VotingPeriod $period
    ): RedirectResponse {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:5000'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'votes_per_voter' => ['required', 'integer', 'min:1', 'max:1000'],
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        $period->update($validated);

        return to_route('admin.periods.index')
            ->with('success', 'Periode voting berhasil diperbarui.');
    }

    /**
     * Menutup periode secara manual.
     */
    public function close(VotingPeriod $period): RedirectResponse
    {
        $period->update([
            'status' => 'private',
        ]);

        return to_route('admin.periods.index')
            ->with('success', 'Periode voting berhasil ditutup.');
    }
}