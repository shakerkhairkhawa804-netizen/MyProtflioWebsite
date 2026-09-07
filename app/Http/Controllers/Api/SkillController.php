<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Get all skills
     */
    public function index()
    {
        $skills = Skill::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Skills retrieved successfully.',
            'data' => $skills,
        ]);
    }

    /**
     * Store a new skill
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'level' => 'required|integer|min:1|max:100',
            'icon' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully.',
            'data' => $skill,
        ], 201);
    }

    /**
     * Get single skill
     */
    public function show(Skill $skill)
    {
        return response()->json([
            'success' => true,
            'message' => 'Skill retrieved successfully.',
            'data' => $skill,
        ]);
    }

    /**
     * Update skill
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'level' => 'required|integer|min:1|max:100',
            'icon' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $skill->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully.',
            'data' => $skill,
        ]);
    }

    /**
     * Delete skill
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully.',
        ]);
    }
}