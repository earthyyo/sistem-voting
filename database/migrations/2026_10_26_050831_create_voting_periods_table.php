
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voting_periods', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);
            $table->text('description')->nullable();

            $table->dateTime('start_at');
            $table->dateTime('end_at');

            // Batas total suara per akun dalam satu periode.
            $table->unsignedInteger('votes_per_voter')->default(1);

            // draft, published, atau closed.
            $table->string('status', 20)->default('draft');

            $table->timestamps();

            $table->index(['status', 'start_at', 'end_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voting_periods');
    }
};
