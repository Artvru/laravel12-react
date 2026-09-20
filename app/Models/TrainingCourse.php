<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingCourse extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'code', 'description', 'content', 'instructor', 'starts_at', 'duration_hours', 'capacity', 'level'];

    protected function casts(): array
    {
        return ['starts_at' => 'date'];
    }

    public function enrollments()
    {
        return $this->hasMany(TrainingEnrollment::class);
    }

    public function quizzes()
    {
        return $this->hasMany(TrainingQuiz::class);
    }
}