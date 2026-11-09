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
    private const STATUSES = ['draft', 'published', 'closed'];

    public function index(): Response
    {
        $periods = VotingPeriod::query()
            ->orderByDesc('start_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (VotingPeriod $period) => [
                'id' => $period->id,
                'name' => $period->name,
                'description' => $period->description,
                'start_at' => $period->start_at->format('Y-m-d\TH:i'),
                'end_at' => $period->end_at->format('Y-m-d\TH:i'),
                'votes_per_voter' => $period->votes_per_voter,
                'status' => $period->status,
                'is_voting_open' => $period->isVotingOpen(),
            ]);

        return Inertia::render('admin/periods/index', [
            'periods' => $periods,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/periods/form', [
            'period' => null,
            'statuses' => self::STATUSES,
        ]);
    }

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
                'status' => $period->status,
            ],
            'statuses' => self::STATUSES,
        ]);
    }

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

    public function close(VotingPeriod $period): RedirectResponse
    {
        $period->update(['status' => 'closed']);

        return to_route('admin.periods.index')
            ->with('success', 'Periode voting berhasil ditutup.');
    }
}