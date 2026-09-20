<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('instructor');
            $table->date('starts_at');
            $table->unsignedInteger('duration_hours')->default(1);
            $table->unsignedInteger('capacity')->default(30);
            $table->string('level')->default('ทั่วไป');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_courses');
    }
};