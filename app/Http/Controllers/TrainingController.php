<?php

namespace App\Http\Controllers;

use App\Models\TrainingAttempt;
use App\Models\TrainingCourse;
use App\Models\TrainingEnrollment;
use App\Models\TrainingQuiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $courses = TrainingCourse::withCount('enrollments')
            ->with('quizzes')
            ->orderBy('starts_at')
            ->get()
            ->map(function (TrainingCourse $course) use ($user) {
                $enrollment = $course->enrollments()->where('user_id', $user->id)->first();
                $preQuiz = $course->quizzes->firstWhere('type', 'pre');
                $postQuiz = $course->quizzes->firstWhere('type', 'post');
                $preAttempt = $preQuiz ? TrainingAttempt::where('user_id', $user->id)->where('training_quiz_id', $preQuiz->id)->latest('submitted_at')->first() : null;
                $postAttempt = $postQuiz ? TrainingAttempt::where('user_id', $user->id)->where('training_quiz_id', $postQuiz->id)->latest('submitted_at')->first() : null;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'code' => $course->code,
                    'description' => $course->description,
                    'content' => $course->content,
                    'instructor' => $course->instructor,
                    'starts_at' => $course->starts_at?->format('Y-m-d'),
                    'duration_hours' => $course->duration_hours,
                    'capacity' => $course->capacity,
                    'enrolled_count' => $course->enrollments_count,
                    'level' => $course->level,
                    'enrollment' => $enrollment ? ['status' => $enrollment->status] : null,
                    'pre_quiz' => $preQuiz ? ['id' => $preQuiz->id, 'title' => $preQuiz->title] : null,
                    'post_quiz' => $postQuiz ? ['id' => $postQuiz->id, 'title' => $postQuiz->title] : null,
                    'pre_attempt' => $preAttempt ? ['score' => $preAttempt->score, 'total_questions' => $preAttempt->total_questions] : null,
                    'post_attempt' => $postAttempt ? ['score' => $postAttempt->score, 'total_questions' => $postAttempt->total_questions] : null,
                    'latest_attempt' => $postAttempt ? ['score' => $postAttempt->score, 'total_questions' => $postAttempt->total_questions] : ($preAttempt ? ['score' => $preAttempt->score, 'total_questions' => $preAttempt->total_questions] : null),
                ];
            });

        $history = TrainingEnrollment::with('course')->where('user_id', $user->id)->latest()->get()->map(fn ($enrollment) => [
            'id' => $enrollment->id,
            'course' => $enrollment->course?->title ?? 'N/A',
            'course_id' => $enrollment->course?->id,
            'code' => $enrollment->course?->code ?? '-',
            'status' => $enrollment->status,
            'completed_at' => $enrollment->completed_at?->format('Y-m-d'),
            'date' => $enrollment->created_at->format('Y-m-d'),
        ]);

        return Inertia::render('Training/Index', [
            'courses' => $courses,
            'history' => $history,
            'stats' => [
                'enrolled' => $history->count(),
                'completed' => $history->where('status', 'completed')->count(),
                'hours' => $history->sum(fn ($item) => $courses->firstWhere('code', $item['code'])['duration_hours'] ?? 0),
            ],
        ]);
    }

    public function enroll(Request $request, TrainingCourse $course)
    {
        abort_if($course->enrollments()->count() >= $course->capacity, 422, 'คอร์สนี้เต็มแล้ว');

        TrainingEnrollment::firstOrCreate([
            'user_id' => $request->user()->id,
            'training_course_id' => $course->id,
        ]);

        $preQuiz = $course->quizzes()->where('type', 'pre')->first();

        return $preQuiz
            ? redirect()->route('training.quiz', $preQuiz->id)->with('success', 'ลงทะเบียนแล้ว กรุณาทำแบบทดสอบก่อนเรียน')
            : back()->with('success', 'ลงทะเบียนคอร์สเรียบร้อยแล้ว');
    }

    public function history(Request $request, TrainingEnrollment $enrollment)
    {
        abort_unless($enrollment->user_id === $request->user()->id, 403);

        $enrollment->load('course.quizzes');
        $quizIds = $enrollment->course->quizzes->pluck('id');
        $attempts = TrainingAttempt::where('user_id', $request->user()->id)
            ->whereIn('training_quiz_id', $quizIds)
            ->latest('submitted_at')
            ->get()
            ->unique('training_quiz_id')
            ->keyBy('training_quiz_id');

        return Inertia::render('Training/History', [
            'enrollment' => [
                'id' => $enrollment->id,
                'status' => $enrollment->status,
                'registered_at' => $enrollment->created_at?->format('Y-m-d'),
                'completed_at' => $enrollment->completed_at?->format('Y-m-d'),
            ],
            'course' => $enrollment->course->only([
                'id', 'title', 'code', 'description', 'instructor', 'starts_at', 'duration_hours', 'level',
            ]),
            'results' => $enrollment->course->quizzes->map(function ($quiz) use ($attempts) {
                $attempt = $attempts->get($quiz->id);

                return [
                    'type' => $quiz->type,
                    'title' => $quiz->title,
                    'pass_score' => $quiz->pass_score,
                    'score' => $attempt?->score,
                    'total_questions' => $attempt?->total_questions,
                    'submitted_at' => $attempt?->submitted_at?->format('Y-m-d'),
                ];
            })->values(),
        ]);
    }

    public function retake(Request $request, TrainingCourse $course)
    {
        $user = $request->user();
        
        $enrollment = TrainingEnrollment::where('user_id', $user->id)
            ->where('training_course_id', $course->id)
            ->firstOrFail();
            
        DB::transaction(function () use ($user, $course, $enrollment) {
            $quizIds = $course->quizzes()->pluck('id');
            TrainingAttempt::where('user_id', $user->id)->whereIn('training_quiz_id', $quizIds)->delete();
            
            $enrollment->update([
                'status' => 'in_progress',
                'completed_at' => null,
            ]);
        });

        $preQuiz = $course->quizzes()->where('type', 'pre')->first();
        
        return $preQuiz
            ? redirect()->route('training.quiz', $preQuiz->id)->with('success', 'เริ่มการอบรมใหม่แล้ว กรุณาทำแบบทดสอบก่อนเรียน Step 1')
            : back()->with('success', 'เริ่มการอบรมใหม่แล้ว');
    }

    public function quiz(Request $request, TrainingQuiz $quiz)
    {
        abort_unless(TrainingEnrollment::where('user_id', $request->user()->id)->where('training_course_id', $quiz->training_course_id)->exists(), 403);

        if ($quiz->type === 'post') {
            $preQuiz = $quiz->course?->quizzes()->where('type', 'pre')->first();
            if ($preQuiz && ! TrainingAttempt::where('user_id', $request->user()->id)->where('training_quiz_id', $preQuiz->id)->exists()) {
                return redirect()->route('training.quiz', $preQuiz->id)->with('warning', 'กรุณาทำแบบทดสอบก่อนเรียนก่อน');
            }
        }

        return Inertia::render('Training/Quiz', [
            'quiz' => $quiz->load('questions:id,training_quiz_id,question,options,sort_order'),
            'course' => $quiz->course?->only(['id', 'title', 'content']),
        ]);
    }

    public function content(Request $request, TrainingCourse $course)
    {
        $enrollment = TrainingEnrollment::where('user_id', $request->user()->id)
            ->where('training_course_id', $course->id)
            ->firstOrFail();
        $preQuiz = $course->quizzes()->where('type', 'pre')->first();

        if ($preQuiz && ! TrainingAttempt::where('user_id', $request->user()->id)->where('training_quiz_id', $preQuiz->id)->exists()) {
            return redirect()->route('training.quiz', $preQuiz->id)->with('warning', 'กรุณาทำแบบทดสอบก่อนเรียนก่อนอ่านเนื้อหา');
        }

        return Inertia::render('Training/Content', [
            'course' => $course,
            'postQuiz' => $course->quizzes()->where('type', 'post')->first(['id', 'title']),
            'enrollment' => $enrollment,
        ]);
    }

    public function submitQuiz(Request $request, TrainingQuiz $quiz)
    {
        abort_unless(TrainingEnrollment::where('user_id', $request->user()->id)->where('training_course_id', $quiz->training_course_id)->exists(), 403);

        $validated = $request->validate(['answers' => ['required', 'array']]);
        $questions = $quiz->questions()->get();
        $answers = $validated['answers'];
        $score = $questions->filter(fn ($question) => (int) ($answers[$question->id] ?? -1) === $question->correct_option)->count();

        DB::transaction(function () use ($request, $quiz, $score, $questions, $answers) {
            TrainingAttempt::create([
                'user_id' => $request->user()->id,
                'training_quiz_id' => $quiz->id,
                'score' => $score,
                'total_questions' => $questions->count(),
                'answers' => $answers,
                'submitted_at' => now(),
            ]);

            if ($quiz->type === 'post' && ($score / max($questions->count(), 1)) * 100 >= $quiz->pass_score) {
                TrainingEnrollment::where('user_id', $request->user()->id)
                    ->where('training_course_id', $quiz->training_course_id)
                    ->update(['status' => 'completed', 'completed_at' => now()]);
            }
        });

        if ($quiz->type === 'pre') {
            return redirect()->route('training.content', ['course' => $quiz->training_course_id])->with('success', "ทำแบบทดสอบก่อนเรียนแล้ว ได้คะแนน {$score}/{$questions->count()}");
        }

        return redirect()->route('training.index')->with('success', "ทำแบบทดสอบหลังเรียนแล้ว ได้คะแนน {$score}/{$questions->count()}");
    }
}