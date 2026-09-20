import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Content({ course, postQuiz, enrollment }) {
    const isCompleted = enrollment && enrollment.status === 'completed';
    return (
        <AuthenticatedLayout header={<div><p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">Learning material</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{course.title}</h1></div>}>
            <Head title={`เนื้อหาอบรม: ${course.title}`} />
            <main className="min-h-screen bg-[#f4f1eb] px-4 py-12 transition-colors sm:px-6 dark:bg-slate-950">
                <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 sm:rounded-[2rem]">
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 sm:px-12 sm:py-14 text-white">
                        <div className="relative z-10 max-w-xl">
                            <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md">{isCompleted ? 'STEP 2/3: ทบทวนเนื้อหา' : 'STEP 2/3: อ่านเนื้อหาการอบรม'}</span>
                            <h2 className="mt-3 text-3xl font-black sm:text-4xl leading-tight">{course.title}</h2>
                            <p className="mt-4 text-sm font-medium text-indigo-50 leading-relaxed max-w-md">{isCompleted ? 'คุณเคยเรียนจบคอร์สนี้แล้ว สามารถทบทวนเนื้อหาและลองทำ Step 3 (แบบทดสอบหลังเรียน) ซ้ำได้ตลอดเวลา' : 'อ่านทำความเข้าใจเนื้อหาทั้งหมดให้ครบถ้วนเพื่อเตรียมความพร้อมสำหรับ Step 3 (แบบทดสอบหลังเรียน)'}</p>
                        </div>
                        <img src="/images/training/cat-hero.png" alt="3D Cat" className="cat-float absolute -bottom-6 -right-6 w-56 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] sm:right-4 sm:w-64" aria-hidden="true" />
                    </div>
                    <div className="p-8 sm:p-12">
                        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                            {course.content || 'ยังไม่มีเนื้อหาอบรมสำหรับคอร์สนี้'}
                        </div>
                        <div className="mt-12 overflow-hidden rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-100 dark:ring-indigo-900/50">
                            <div className="px-6 py-8 sm:p-10 text-center">
                                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">{isCompleted ? 'พร้อมทดสอบความรู้อีกรอบไหม?' : 'อ่านจบแล้วใช่ไหม? ไปลุยต่อ Step 3 กันเลย!'}</h3>
                                {postQuiz && <Link href={route('training.quiz', postQuiz.id)} className="inline-block w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-4 text-center text-lg font-black text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 hover:bg-indigo-700 dark:shadow-indigo-900/40">{isCompleted ? 'Step 3: ทำแบบทดสอบหลังเรียนซ้ำ' : 'ไปทำ Step 3: แบบทดสอบหลังเรียน'}</Link>}
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </AuthenticatedLayout>
    );
}