<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Get all experiences
     */
    public function index()
    {
        $experiences = Experience::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Experiences retrieved successfully.',
            'data' => $experiences,
        ]);
    }

    /**
     * Store a new experience
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',

            'employment_type' => [
                'required',
                'in:Full-time,Part-time,Freelance,Internship,Contract',
            ],

            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',

            'is_current' => 'boolean',

            'description' => 'nullable|string',

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | If current job is true, end date should be null
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['is_current'])) {
            $validated['end_date'] = null;
        }

        $experience = Experience::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experience created successfully.',
            'data' => $experience,
        ], 201);
    }

    /**
     * Get a single experience
     */
    public function show(Experience $experience)
    {
        return response()->json([
            'success' => true,
            'message' => 'Experience retrieved successfully.',
            'data' => $experience,
        ]);
    }

    /**
     * Update an experience
     */
    public function update(
        Request $request,
        Experience $experience
    ) {
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',

            'employment_type' => [
                'required',
                'in:Full-time,Part-time,Freelance,Internship,Contract',
            ],

            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',

            'is_current' => 'boolean',

            'description' => 'nullable|string',

            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Current job does not have an end date
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['is_current'])) {
            $validated['end_date'] = null;
        }

        $experience->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experience updated successfully.',
            'data' => $experience->fresh(),
        ]);
    }

    /**
     * Delete an experience
     */
    public function destroy(Experience $experience)
    {
        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted successfully.',
        ]);
    }
}