<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use App\Models\MenuItem;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



//เราเพิ่มเองตั้งแต่อันนี้ลงไป
Route::get('/product', function () {
    $products = Product::all();
    return response()->json($products);
});


//quiz4
Route::get('/quiz4', function () {
    $menuItems = MenuItem::all();
    return response()->json($menuItems);
});