<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingQuestion extends Model
{
    protected $fillable = ['training_quiz_id', 'question', 'options', 'correct_option', 'sort_order'];

    protected function casts(): array
    {
        return ['options' => 'array'];
    }
}