<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Get all services
     */
    public function index()
    {
        $services = Service::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * Store service
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
            'gradient' => 'nullable|string|max:100',
            'price' => 'nullable|string|max:100',
            'status' => 'required|in:New,Featured,Active,Inactive',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service added successfully.',
            'data' => $service,
        ], 201);
    }

    /**
     * Show service
     */
    public function show(Service $service)
    {
        return response()->json([
            'success' => true,
            'data' => $service,
        ]);
    }

    /**
     * Update service
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
            'gradient' => 'nullable|string|max:100',
            'price' => 'nullable|string|max:100',
            'status' => 'required|in:New,Featured,Active,Inactive',
        ]);

        $service->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully.',
            'data' => $service->fresh(),
        ]);
    }

    /**
     * Delete service
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.',
        ]);
    }
}