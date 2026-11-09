
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\VoterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\VotingPeriodController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VoteController as AdminVoteController;
use App\Http\Controllers\Admin\VoterController as AdminVoterController;

// ========================================
// HALAMAN UMUM
// ========================================

Route::get('/', [VoterController::class, 'home'])
    ->name('home');

// ========================================
// LOGIN & REGISTER
// ========================================

Route::get('/register', [AuthController::class, 'showRegister'])
    ->name('register');

Route::post('/register', [AuthController::class, 'register'])
    ->name('register.store');

Route::get('/login', [AuthController::class, 'showLogin'])
    ->name('login');

Route::post('/login', [AuthController::class, 'login'])
    ->name('login.store');

// ========================================
// FORGOT & RESET PASSWORD
// ========================================

Route::middleware('guest')->group(function () {

    Route::get('/forgot-password', [PasswordResetController::class, 'create'])
        ->name('password.request');

    Route::post('/forgot-password', [PasswordResetController::class, 'store'])
        ->name('password.email');

    Route::get('/reset-password/{token}', [PasswordResetController::class, 'edit'])
        ->name('password.reset');

    Route::post('/reset-password', [PasswordResetController::class, 'update'])
        ->name('password.update');

});

// ========================================
// LOGOUT
// ========================================

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// ========================================
// HALAMAN VOTER
// ========================================

Route::middleware(['auth', 'voter'])->group(function () {

    Route::get('/dashboard', [VoterController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('/members', [VoterController::class, 'members'])
        ->name('members');

    Route::get('/ranking', [VoterController::class, 'ranking'])
        ->name('ranking');

    Route::get('/history', [VoterController::class, 'history'])
        ->name('history');

    // Profil Voter
    Route::get('/profile', [VoterController::class, 'profile'])
        ->name('profile');

    Route::patch('/profile', [VoterController::class, 'updateProfile'])
        ->name('profile.update');

    Route::post('/profile/photo', [VoterController::class, 'updateProfilePhoto'])
        ->name('profile.photo.update');

    Route::put('/profile/password', [VoterController::class, 'updatePassword'])
        ->name('profile.password.update');

    // Voting
    Route::post('/votes', [VoteController::class, 'store'])
        ->name('votes.store');

});

// ========================================
// HALAMAN ADMIN
// ========================================


Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard Admin
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        // Kelola Member
        Route::get('/members', [MemberController::class, 'index'])
            ->name('members.index');

        Route::get('/members/create', [MemberController::class, 'create'])
            ->name('members.create');

        Route::post('/members', [MemberController::class, 'store'])
            ->name('members.store');

        Route::get('/members/{member}/edit', [MemberController::class, 'edit'])
            ->name('members.edit');

        Route::put('/members/{member}', [MemberController::class, 'update'])
            ->name('members.update');

        Route::patch('/members/{member}/deactivate', [MemberController::class, 'deactivate'])
            ->name('members.deactivate');

        // Kelola Periode Voting
        Route::get('/periods', [VotingPeriodController::class, 'index'])
            ->name('periods.index');

        Route::get('/periods/create', [VotingPeriodController::class, 'create'])
            ->name('periods.create');

        Route::post('/periods', [VotingPeriodController::class, 'store'])
            ->name('periods.store');

        Route::get('/periods/{period}/edit', [VotingPeriodController::class, 'edit'])
            ->name('periods.edit');

        Route::put('/periods/{period}', [VotingPeriodController::class, 'update'])
            ->name('periods.update');

        Route::patch('/periods/{period}/close', [VotingPeriodController::class, 'close'])
            ->name('periods.close');

        // Data Vote
        Route::get('/votes', [AdminVoteController::class, 'index'])
            ->name('votes.index');

        // Data Voter
        Route::get('/voters', [AdminVoterController::class, 'index'])
            ->name('voters.index');

        // Detail Voter
        Route::get('/voters/{voter}', [AdminVoterController::class, 'show'])
            ->whereNumber('voter')
            ->name('voters.show');

    });