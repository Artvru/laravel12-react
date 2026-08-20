<?php

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