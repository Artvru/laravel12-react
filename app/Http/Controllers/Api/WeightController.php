<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Weight;
use Illuminate\Http\Request;

class WeightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $weights = Weight::orderBy('weight_date', 'desc')->get();
        return response()->json($weights);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight_date' => 'required|date|date_format:Y-m-d',
            'weight_value' => 'required|numeric|between:30,200',
            'note' => 'nullable|string|max:255',
        ]);

        $weight = Weight::create($validated);
        return response()->json([
            'message' => 'Weight recorded successfully!',
            'weight' => $weight
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $weight = Weight::findOrFail($id);
        return response()->json($weight);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $weight = Weight::findOrFail($id);

        $validated = $request->validate([
            'weight_date' => 'sometimes|required|date|date_format:Y-m-d',
            'weight_value' => 'sometimes|required|numeric|between:30,200',
            'note' => 'nullable|string|max:255',
        ]);

        $weight->update($validated);
        return response()->json([
            'message' => 'Weight updated successfully!',
            'weight' => $weight
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $weight = Weight::findOrFail($id);
        $weight->delete();
        return response()->json([
            'message' => 'Weight deleted successfully!'
        ]);
    }
}