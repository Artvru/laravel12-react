<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingEnrollment extends Model
{
    protected $fillable = ['user_id', 'training_course_id', 'status', 'completed_at'];

    protected function casts(): array
    {
        return ['completed_at' => 'datetime'];
    }

    public function course()
    {
        return $this->belongsTo(TrainingCourse::class, 'training_course_id');
    }
}