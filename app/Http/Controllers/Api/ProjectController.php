<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([

            'title' => 'required|string|max:255',

            'category' => 'required|string|max:255',

            'description' => 'required|string',

            'technologies' => 'nullable|array',

            'technologies.*' => 'string|max:100',

            'status' => 'nullable|string|max:100',

            'icon' => 'nullable|string|max:20',

            'gradient' => 'nullable|string|max:100',

            'live_url' => 'nullable|url|max:500',

            'github_url' => 'nullable|url|max:500',

        ]);


        $project = Project::create([

            'title' =>
                $validated['title'],

            'category' =>
                $validated['category'],

            'description' =>
                $validated['description'],

            'technologies' =>
                $validated['technologies'] ?? [],

            'status' =>
                $validated['status'] ?? 'New',

            'icon' =>
                $validated['icon'] ?? '⚡',

            'gradient' =>
                $validated['gradient'] ?? 'project-cyan',

            'live_url' =>
                $validated['live_url'] ?? null,

            'github_url' =>
                $validated['github_url'] ?? null,

        ]);


        return response()->json([

            'success' => true,

            'message' =>
                'Project added successfully.',

            'data' =>
                $project,

        ], 201);
    }


    public function show(Project $project)
    {
        return response()->json([

            'success' => true,

            'data' => $project,

        ]);
    }


    public function update(
        Request $request,
        Project $project
    ) {

        $validated = $request->validate([

            'title' =>
                'required|string|max:255',

            'category' =>
                'required|string|max:255',

            'description' =>
                'required|string',

            'technologies' =>
                'nullable|array',

            'technologies.*' =>
                'string|max:100',

            'status' =>
                'nullable|string|max:100',

            'icon' =>
                'nullable|string|max:20',

            'gradient' =>
                'nullable|string|max:100',

            'live_url' =>
                'nullable|url|max:500',

            'github_url' =>
                'nullable|url|max:500',

        ]);


        $project->update($validated);


        return response()->json([

            'success' => true,

            'message' =>
                'Project updated successfully.',

            'data' =>
                $project->fresh(),

        ]);
    }


    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([

            'success' => true,

            'message' =>
                'Project deleted successfully.',

        ]);
    }
}