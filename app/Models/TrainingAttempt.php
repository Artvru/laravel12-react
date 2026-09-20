<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingAttempt extends Model
{
    protected $fillable = ['user_id', 'training_quiz_id', 'score', 'total_questions', 'answers', 'submitted_at'];

    protected function casts(): array
    {
        return ['answers' => 'array', 'submitted_at' => 'datetime'];
    }
}