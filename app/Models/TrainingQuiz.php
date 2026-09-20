<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingQuiz extends Model
{
    protected $fillable = ['training_course_id', 'title', 'type', 'pass_score'];

    public function course()
    {
        return $this->belongsTo(TrainingCourse::class, 'training_course_id');
    }

    public function questions()
    {
        return $this->hasMany(TrainingQuestion::class)->orderBy('sort_order');
    }
}