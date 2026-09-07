<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Get all education records.
     */
    public function index()
    {
        $educations = Education::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Educations retrieved successfully.',
            'data' => $educations,
        ]);
    }

    /**
     * Store a new education record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'degree' => [
                'required',
                'string',
                'max:255',
            ],

            'institution' => [
                'required',
                'string',
                'max:255',
            ],

            'field_of_study' => [
                'required',
                'string',
                'max:255',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'start_date' => [
                'required',
                'date_format:Y-m-d',
            ],

            'end_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Normalize boolean
        |--------------------------------------------------------------------------
        */

        $validated['is_current'] =
            filter_var(
                $validated['is_current'] ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

        /*
        |--------------------------------------------------------------------------
        | If currently studying, end date must be null
        |--------------------------------------------------------------------------
        */

        if ($validated['is_current'] === true) {
            $validated['end_date'] = null;
            $validated['status'] = 'Active';
        }

        $education = Education::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Education created successfully.',
            'data' => $education,
        ], 201);
    }

    /**
     * Get one education record.
     */
    public function show(Education $education)
    {
        return response()->json([
            'success' => true,
            'message' => 'Education retrieved successfully.',
            'data' => $education,
        ]);
    }

    /**
     * Update education record.
     */
    public function update(
        Request $request,
        Education $education
    ) {
        $validated = $request->validate([
            'degree' => [
                'required',
                'string',
                'max:255',
            ],

            'institution' => [
                'required',
                'string',
                'max:255',
            ],

            'field_of_study' => [
                'required',
                'string',
                'max:255',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'start_date' => [
                'required',
                'date_format:Y-m-d',
            ],

            'end_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Normalize boolean
        |--------------------------------------------------------------------------
        */

        $validated['is_current'] =
            filter_var(
                $validated['is_current'] ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

        /*
        |--------------------------------------------------------------------------
        | Currently studying
        |--------------------------------------------------------------------------
        */

        if ($validated['is_current'] === true) {
            $validated['end_date'] = null;
            $validated['status'] = 'Active';
        }

        $education->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Education updated successfully.',
            'data' => $education->fresh(),
        ]);
    }

    /**
     * Delete education record.
     */
    public function destroy(Education $education)
    {
        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education deleted successfully.',
        ]);
    }
}