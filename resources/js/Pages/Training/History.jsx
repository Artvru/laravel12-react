import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatDate = (value) => value
    ? new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '-';

export default function History({ course, enrollment, results }) {
    return (
        <AuthenticatedLayout header={<div><p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">Training history</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">ประวัติการอบรม</h1></div>}>
            <Head title={`ประวัติการอบรม - ${course.title}`} />
            <main className="min-h-screen bg-[#f4f1eb] px-4 py-8 transition-colors sm:px-6 lg:px-8 dark:bg-slate-950">
                <div className="mx-auto max-w-4xl">
                    <Link href={route('training.index')} className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400">← กลับไปหน้า Training</Link>
                    <section className="mt-5 bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div><p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{course.code}</p><h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{course.title}</h2><p className="mt-3 text-slate-600 dark:text-slate-300">{course.description}</p></div>
                            <span className={enrollment.status === 'completed' ? 'bg-teal-100 px-3 py-1 text-sm font-bold text-teal-800' : 'bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800'}>{enrollment.status === 'completed' ? 'เรียนจบแล้ว' : 'กำลังเรียน'}</span>
                        </div>
                        <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-6 text-sm dark:border-slate-700 sm:grid-cols-2"><div><dt className="text-slate-500">ผู้สอน</dt><dd className="mt-1 font-bold text-slate-900 dark:text-white">{course.instructor || '-'}</dd></div><div><dt className="text-slate-500">ระยะเวลา</dt><dd className="mt-1 font-bold text-slate-900 dark:text-white">{course.duration_hours} ชั่วโมง</dd></div><div><dt className="text-slate-500">วันที่ลงทะเบียน</dt><dd className="mt-1 font-bold text-slate-900 dark:text-white">{formatDate(enrollment.registered_at)}</dd></div><div><dt className="text-slate-500">วันที่เรียนจบ</dt><dd className="mt-1 font-bold text-slate-900 dark:text-white">{formatDate(enrollment.completed_at)}</dd></div></dl>
                    </section>
                    <section className="mt-6 bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8"><h2 className="text-xl font-black text-slate-950 dark:text-white">ผลการอบรม</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{results.map((result) => <div key={result.type} className="border border-slate-200 p-5 dark:border-slate-700"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{result.type === 'pre' ? 'แบบทดสอบก่อนเรียน' : 'แบบทดสอบหลังเรียน'}</p><h3 className="mt-2 font-bold text-slate-900 dark:text-white">{result.title}</h3><p className="mt-4 text-2xl font-black text-indigo-600 dark:text-indigo-400">{result.score !== null ? `${result.score}/${result.total_questions}` : 'ยังไม่ได้ทำ'}</p>{result.score !== null && <p className="mt-1 text-xs text-slate-500">ทำเมื่อ {formatDate(result.submitted_at)}{result.type === 'post' ? ` • เกณฑ์ผ่าน ${result.pass_score}%` : ''}</p>}</div>)}</div></section>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}