<?php


use Illuminate\Support\Facades\Hash; //ถ้ามีอะไรเกิดขึ้นลบไอนี่ก่อนเลย
use App\Models\User; // <-- สำคัญ: ต้อง Import User Model เข้ามาใช้งาน


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use App\Models\MenuItem;
use App\Http\Controllers\Api\WeightController;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/quiz4', function () {
    $menuItems = MenuItem::all();
    return response()->json($menuItems);
});

Route::apiResource('/weights', WeightController::class);
Route::apiResource('/product', ProductController::class);


//เพิ่มข้อมูลวันที่27สิงหาคม
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Route สำหรับ Login และรับ Token
Route::post('/sanctum/token', function (Request $request) {
    // ตรวจสอบว่ามี Email นี้ในระบบหรือไม่
    $user = User::where('email', $request->email)->first();

    // เช็คกรณีหา User ไม่เจอ หรือ รหัสผ่านไม่ถูกต้อง
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'email' => ['The provided credentials are incorrect.']
        ], 401); // 401 Unauthorized
    }

    // สร้าง Token และคืนค่ากลับไป
    return response()->json([
        'token' => $user->createToken($request->device_name ?? 'mobile_app')->plainTextToken
    ]);
});

// 2. Route สำหรับ สมัครสมาชิก (Register) และรับ Token ทันที
Route::post('/sanctum/token/register', function (Request $request) {
    // เช็คว่า Email ถูกใช้ไปแล้วหรือยัง
    $user = User::where('email', $request->email)->first();
    if ($user) {
        return response()->json([
            'email' => ['The email is already in use.']
        ], 422); // 422 Unprocessable Entity
    }

    // สร้าง User ใหม่ในฐานข้อมูล
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // สร้าง Token ให้ User ใหม่ทันที
    return response()->json([
        'token' => $user->createToken($request->device_name ?? 'mobile_app')->plainTextToken
    ]);
});