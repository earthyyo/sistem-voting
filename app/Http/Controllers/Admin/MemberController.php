<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{
    private const GENERATIONS = [3, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    private const TEAMS = ['Love', 'Dream', 'Passion'];

    public function index(Request $request): Response
    {
        $query = Member::query();

        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        $search = $request->string('search')->trim()->toString();

        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        $members = $query
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Member $member) => [
                'id' => $member->id,
                'name' => $member->name,
                'description' => $member->description,
                'birth_place' => $member->birth_place,
                'birth_date' => $member->birth_date?->format('Y-m-d'),
                'generation' => $member->generation,
                'team' => $member->team,
                'photo_url' => $member->photo_url,
                'is_active' => $member->is_active,
            ]);

        return Inertia::render('admin/Members/index', [
            'members' => $members,
            'filters' => [
                'search' => $search,
                'include_inactive' => $request->boolean('include_inactive'),
            ],
            'generations' => self::GENERATIONS,
            'teams' => self::TEAMS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/Members/form', [
            'member' => null,
            'generations' => self::GENERATIONS,
            'teams' => self::TEAMS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Log::info('DEBUG UPLOAD MEMBER', [
    'has_file' => $request->hasFile('photo'),
    'file_name' => $request->file('photo')?->getClientOriginalName(),
    'file_size' => $request->file('photo')?->getSize(),
    'file_valid' => $request->file('photo')?->isValid(),
    'file_error' => $request->file('photo')?->getError(),
]);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:3000'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'generation' => ['required', 'integer', Rule::in(self::GENERATIONS)],
            'team' => ['required', Rule::in(self::TEAMS)],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')
                ->store('members', 'public');
        }

        unset($validated['photo']);

        Member::create($validated);

        return to_route('admin.members.index')
            ->with('success', 'Member berhasil ditambahkan.');
    }

    public function edit(Member $member): Response
    {
        return Inertia::render('admin/Members/form', [
            'member' => [
                'id' => $member->id,
                'name' => $member->name,
                'description' => $member->description,
                'birth_place' => $member->birth_place,
                'birth_date' => $member->birth_date?->format('Y-m-d'),
                'generation' => $member->generation,
                'team' => $member->team,
                'photo_url' => $member->photo_url,
                'is_active' => $member->is_active,
            ],
            'generations' => self::GENERATIONS,
            'teams' => self::TEAMS,
        ]);
    }

    public function update(Request $request, Member $member): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:3000'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'generation' => ['required', 'integer', Rule::in(self::GENERATIONS)],
            'team' => ['required', Rule::in(self::TEAMS)],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            if ($member->photo_path) {
                Storage::disk('public')->delete($member->photo_path);
            }

            $validated['photo_path'] = $request->file('photo')
                ->store('members', 'public');
        }

        unset($validated['photo']);

        $member->update($validated);

        return to_route('admin.members.index')
            ->with('success', 'Data member berhasil diperbarui.');
    }

    public function deactivate(Member $member): RedirectResponse
    {
        $member->update(['is_active' => false]);

        return to_route('admin.members.index')
            ->with('success', 'Member berhasil dinonaktifkan.');
    }
    
} 