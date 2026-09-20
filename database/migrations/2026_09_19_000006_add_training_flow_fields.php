<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_courses', function (Blueprint $table) {
            $table->longText('content')->nullable()->after('description');
        });

        Schema::table('training_quizzes', function (Blueprint $table) {
            $table->string('type')->default('post')->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('training_quizzes', fn (Blueprint $table) => $table->dropColumn('type'));
        Schema::table('training_courses', fn (Blueprint $table) => $table->dropColumn('content'));
    }
};