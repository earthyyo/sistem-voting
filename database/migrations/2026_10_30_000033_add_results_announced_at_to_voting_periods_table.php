<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up(): void
    {
        Schema::table('voting_periods', function (Blueprint $table) {
            $table->timestamp('results_announced_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('voting_periods', function (Blueprint $table) {
            if (Schema::hasColumn('voting_periods', 'results_announced_at')) {
                $table->dropColumn('results_announced_at');
            }
        });
    }
};