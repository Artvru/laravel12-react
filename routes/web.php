<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;

use App\Models\Weight; //เชื่อมกับชื่อเดียวกันด้านล่างถ้าไม่มีอันนี้อันรล่างใช้ไม่ได้ 

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/hello-teacher', function () {
    return Inertia::render('HelloTeacher');
})->name('hello-teacher');

Route::get('/about-page', function () {
    return Inertia::render('AboutPage');
})->name('about-page');

Route::get('/home-page', function () {
    return Inertia::render('HomePage');
})->name('home-page');

Route::get('/bootstrap', function () {
    return Inertia::render('BootstrapContent');
})->name('bootstrap');

Route::get('/circle', function () {
    return Inertia::render('Circle');
})->name('circle');

Route::get('/counter', function () {
    return Inertia::render('Counter');
})->name('counter');

Route::get('/form-example', function () {
    return Inertia::render('FormExample');
})->name('form-example');

Route::get('/list-manager', function () {
    return Inertia::render('ListManager');
})->name('list-manager');

Route::get('/infinite-scroll', function () {
    return Inertia::render('InfiniteScrollExample');
})->name('infinite-scroll');

//------------------------------------------------
//quiz3
Route::get('/investment-log', function () {
    return Inertia::render('InvestmentLog');
})->name('investment-log'); //เวลาเปิดเว็ปใช้อันล่าง investment-log


//Ep04 ในclassroom เป็นต้นไป หมายถึงตั้งแต่ข้างล่างลงไปเป็น EP04
Route::get('/product', function () {
    $products = Product::all();
    return Inertia::render('ProductList', compact('products') );
})->name('product');

//ดึงข้อมูลแบบที่ 2 (Fetch จาก GitHub JSON)
Route::get('/product-others', function () {
    return Inertia::render('ProductOthers');
})->name('product-others');

//quiz4
Route::get('/quiz4', function () {
    return Inertia::render('Quiz4');
})->name('quiz4');

//สัปดาห์ทีใหม่
// Weight Tracker Routes
Route::get('/weight-tracker', function () {
    return Inertia::render('WeightTracker');
})->name('weight-tracker');

Route::get('/weight/create', function () {
    return Inertia::render('WeightForm');
})->name('weight.create');

Route::get('/weight/{id}/edit', function ($id) {
    $weight = Weight::findOrFail($id);
    return Inertia::render('WeightForm', compact('weight'));
})->name('weight.edit');