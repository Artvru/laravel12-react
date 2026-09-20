import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Quiz({ quiz }) {
    const form = useForm({ answers: {} });
    const selectAnswer = (questionId, option) => form.setData('answers', { ...form.data.answers, [questionId]: option });
    const submit = (event) => {
        event.preventDefault();
        form.post(route('training.quiz.submit', quiz.id));
    };

    const isPreTest = quiz.type === 'pre';
    return (
        <AuthenticatedLayout header={<div><p className="text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-600">{isPreTest ? 'Before training' : 'After training'}</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{quiz.title}</h1></div>}>
            <Head title={quiz.title} />
            <main className="min-h-screen bg-[#f4f1eb] px-4 py-8 transition-colors sm:px-6 dark:bg-slate-950">
                <form onSubmit={submit} className="mx-auto max-w-3xl">
                    {form.errors?.answers && (
                        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                            ⚠ กรุณาตอบคำตอบให้ครบทุกข้อก่อนกดส่ง
                        </div>
                    )}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-8 py-10 text-white shadow-2xl shadow-rose-500/30 sm:px-12">
                        <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md">{isPreTest ? 'STEP 1/3: แบบทดสอบก่อนเรียน (3 ข้อ)' : 'STEP 3/3: แบบทดสอบหลังเรียน'}</span>
                                <h2 className="mt-3 text-3xl font-black md:text-4xl">{isPreTest ? 'แบบทดสอบวัดความรู้ก่อนเรียน' : 'แบบทดสอบประเมินผลหลังเรียน'}</h2>
                                <p className="mt-3 text-sm font-medium text-rose-50">{isPreTest ? `มีทั้งหมด ${quiz.questions.length} ข้อ • ทำเสร็จแล้วจะสามารถผ่านไปยัง Step 2 (อ่านเนื้อหา)` : `มีทั้งหมด ${quiz.questions.length} ข้อ • ผ่านเกณฑ์ที่ ${quiz.pass_score}% เพื่อสำเร็จคอร์ส`}</p>
                            </div>
                        </div>
                        <img src="/images/training/cat-quiz.png" alt="3D Cat Quiz" className="cat-float absolute -bottom-4 -right-12 w-52 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] sm:right-0 sm:w-64" aria-hidden="true" />
                    </div>
                    {quiz.questions.map((question, index) => 
                        <fieldset key={question.id} className="mb-6 rounded-[1.5rem] bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                            <legend className="text-lg font-black text-slate-950 dark:text-white mb-4 block"><span className="text-fuchsia-500 mr-2">{index + 1}.</span> {question.question}</legend>
                            <div className="mt-5 grid gap-3">
                                {question.options.map((option, optionIndex) => 
                                    <label key={option} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 sm:px-6 text-sm transition-all dark:border-slate-700 dark:text-slate-200 ${form.data.answers[question.id] === optionIndex ? 'border-fuchsia-500 bg-fuchsia-50/50 font-bold shadow-md shadow-fuchsia-100/50 dark:bg-fuchsia-900/20 dark:shadow-fuchsia-900/40' : 'border-slate-200 hover:border-fuchsia-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <input type="radio" name={`question-${question.id}`} checked={form.data.answers[question.id] === optionIndex} onChange={() => selectAnswer(question.id, optionIndex)} className="h-5 w-5 border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500 dark:border-slate-600 dark:bg-slate-800" />
                                        <span className={form.data.answers[question.id] === optionIndex ? 'text-fuchsia-900 dark:text-fuchsia-100' : 'text-slate-700 dark:text-slate-300'}>{option}</span>
                                    </label>
                                )}
                            </div>
                        </fieldset>
                    )}
                    <button disabled={form.processing} className="mt-8 w-full rounded-2xl bg-fuchsia-600 px-5 py-5 text-lg font-black text-white shadow-lg shadow-fuchsia-200 transition hover:-translate-y-1 hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:shadow-fuchsia-900/30">
                        {form.processing ? 'กำลังส่งข้อมูล...' : isPreTest ? 'ส่งคำตอบ (Step 1) แล้วไปอ่านเนื้อหา (Step 2)' : 'ส่งคำตอบ (Step 3) เพื่อประเมินผล'}
                    </button>
                </form>
            </main>
        </AuthenticatedLayout>
    );
}