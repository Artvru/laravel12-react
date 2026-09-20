import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

const formatDate = (value) => new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

function Stat({ label, value, accent }) {
    return <div className="border-l-4 bg-white px-5 py-4 shadow-sm dark:bg-slate-900" style={{ borderColor: accent }}><p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</p></div>;
}

export default function Index({ courses, history, stats }) {
    const { flash } = usePage().props;
    const form = useForm();
    const sliderRef = useRef(null);

    const scrollLeft = () => sliderRef.current?.scrollBy({ left: -360, behavior: 'smooth' });
    const scrollRight = () => sliderRef.current?.scrollBy({ left: 360, behavior: 'smooth' });

    const enroll = (courseId) => form.post(route('training.enroll', courseId), { preserveScroll: true });
    const retakeCourse = (courseId) => form.post(route('training.retake', courseId), { preserveScroll: true });

    return (
        <AuthenticatedLayout header={<div><p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">People development</p><h1 className="mt-2 text-3xl font-black text-slate-950">Training hub</h1></div>}>
            <Head title="Training hub" />
            <div className="min-h-screen bg-[#f4f1eb] px-4 py-8 transition-colors sm:px-6 lg:px-8 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl">
                    {flash?.success && <div className="mb-6 border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-800">{flash.success}</div>}
                    {flash?.warning && <div className="mb-6 border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-800">{flash.warning}</div>}
                    <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-10 text-white shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-900/30 sm:px-12 object-contain">
                        <div className="relative z-10 max-w-xl"><p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">Continuous Learning</p><h2 className="mt-2 text-3xl font-black md:text-5xl">Upskill & Grow <br />อย่างไม่มีที่สิ้นสุด</h2><p className="mt-4 text-base font-medium text-indigo-100">ทบทวนเนื้อหา ทำแบบทดสอบ และพัฒนาตัวเองไปพร้อมกับเพื่อนคอร์گی 3D ตัวโปรดของคุณ!</p></div><img src="/images/training/cat-hero.png" alt="3D Cat" className="cat-float absolute -bottom-6 right-0 w-56 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] sm:right-10 sm:w-72" aria-hidden="true" />
                    </section>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <Stat label="คอร์สที่ลงทะเบียน" value={stats.enrolled} accent="#f97316" />
                        <Stat label="เรียนจบแล้ว" value={stats.completed} accent="#0f766e" />
                        <Stat label="ชั่วโมงการเรียนรู้" value={`${stats.hours} ชม.`} accent="#eab308" />
                    </section>

                    <section className="mt-10">
                        <div className="flex items-center justify-between gap-4">
                            <div><p className="text-sm font-bold text-orange-600">UP NEXT</p><h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">คอร์สที่เปิดให้ลงทะเบียน ({courses.length} คอร์ส)</h2></div>
                            <div className="flex items-center gap-2">
                                <button onClick={scrollLeft} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">
                                    ‹
                                </button>
                                <button onClick={scrollRight} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">
                                    ›
                                </button>
                            </div>
                        </div>

                        <div ref={sliderRef} className="mt-5 flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {courses.map((course) => {
                                const isEnrolled = Boolean(course.enrollment);
                                const isFull = course.enrolled_count >= course.capacity;
                                const nextStep = !isEnrolled ? 'enroll' : (course.pre_quiz && !course.pre_attempt) ? 'pre' : !course.post_attempt ? 'content' : 'complete';
                                return <article key={course.id} className="snap-start flex flex-col min-w-[310px] sm:min-w-[350px] max-w-[380px] flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800">
                                    <div className="p-6 flex flex-col h-full items-stretch">
                                        <div className="flex items-start justify-between gap-3"><span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">{course.code}</span><span className="text-xs font-semibold text-slate-500">{course.level}</span></div>
                                        <h3 className="mt-5 text-xl font-black leading-tight text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                                        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-grow">{course.description}</p>

                                        <div className="mt-4 flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <span className={`font-bold ${course.pre_attempt ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>Step 1: สอบก่อนเรียน (3 ข้อ)</span>
                                            <span className="text-slate-300 dark:text-slate-600">→</span>
                                            <span className={`font-bold ${course.pre_attempt && !course.post_attempt ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : course.post_attempt ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>Step 2: เนื้อหา</span>
                                            <span className="text-slate-300 dark:text-slate-600">→</span>
                                            <span className={`font-bold ${course.post_attempt ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>Step 3: สอบหลังเรียน</span>
                                        </div>

                                        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"><div className="flex justify-between"><dt>วันที่เริ่ม</dt><dd className="font-bold text-slate-900 dark:text-white">{formatDate(course.starts_at)}</dd></div><div className="flex justify-between"><dt>ระยะเวลา</dt><dd className="font-bold text-slate-900 dark:text-white">{course.duration_hours} ชั่วโมง</dd></div></dl>
                                        <div className="mt-5 flex items-center justify-end text-xs text-slate-500">{course.latest_attempt && <span className="font-bold text-teal-600">ล่าสุดคะแนน {course.latest_attempt.score}/{course.latest_attempt.total_questions}</span>}</div>
                                        <div className="mt-5 flex gap-2">{nextStep === 'enroll' ? <button disabled={isFull || form.processing} onClick={() => enroll(course.id)} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:shadow-indigo-900/30">{isFull ? 'คอร์สเต็มแล้ว' : 'ลงทะเบียน'}</button> : nextStep === 'pre' && course.pre_quiz ? <Link href={route('training.quiz', course.pre_quiz.id)} className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-700 dark:shadow-purple-900/30">Step 1: ทดสอบก่อนเรียน</Link> : nextStep === 'content' || (nextStep === 'pre' && !course.pre_quiz) ? <Link href={route('training.content', { course: course.id })} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:shadow-indigo-900/30">Step 2: อ่านเนื้อหา</Link> : <button disabled={form.processing} onClick={() => retakeCourse(course.id)} className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 bg-opacity-70 px-4 py-3 text-center text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60">อบรมใหม่เริ่มที่ Step 1 ↺</button>}</div>
                                    </div>
                                </article>;
                            })}
                        </div>
                    </section>

                    <section className="mt-12 bg-white p-6 shadow-sm dark:bg-slate-900"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-teal-700">YOUR JOURNEY</p><h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">ประวัติการฝึกอบรม</h2></div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400"><tr><th className="pb-3">คอร์ส</th><th className="pb-3">วันที่ลงทะเบียน</th><th className="pb-3">สถานะ</th><th className="pb-3">วันที่เรียนจบ</th></tr></thead><tbody>{history.map((item) => <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700"><td className="py-4">{item.course_id ? <Link href={route('training.content', { course: item.course_id })} className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" title="คลิกเพื่อดูเนื้อหาอบรม">{item.course}</Link> : <span className="font-bold text-slate-700 dark:text-slate-300">{item.course}</span>}<p className="text-xs text-slate-500">{item.code}</p></td><td className="py-4 text-slate-600 dark:text-slate-300">{formatDate(item.date)}</td><td className="py-4"><span className={item.status === 'completed' ? 'bg-teal-100 px-2 py-1 text-xs font-bold text-teal-800' : 'bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800'}>{item.status === 'completed' ? 'เรียนจบแล้ว' : 'กำลังเรียน'}</span></td><td className="py-4 text-slate-600 dark:text-slate-300">{item.completed_at ? formatDate(item.completed_at) : '—'}</td></tr>)}</tbody></table>{history.length === 0 && <p className="py-10 text-center text-slate-500 dark:text-slate-400">ยังไม่มีประวัติการลงทะเบียน</p>}</div></section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}