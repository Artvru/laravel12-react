<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('pass_score')->default(60);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_quizzes');
    }
};