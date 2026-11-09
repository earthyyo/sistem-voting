<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('member_id')
                ->constrained('members')
                ->restrictOnDelete();

            $table->foreignId('voting_period_id')
                ->constrained('voting_periods')
                ->restrictOnDelete();

            $table->timestamps();

            $table->index(
                ['user_id', 'voting_period_id'],
                'votes_user_period_index'
            );

            $table->index(
                ['voting_period_id', 'member_id'],
                'votes_period_member_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
