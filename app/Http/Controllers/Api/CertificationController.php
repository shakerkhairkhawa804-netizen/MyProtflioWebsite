<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificationController extends Controller
{
    /**
     * Display all certifications.
     */
    public function index(): JsonResponse
    {
        $certifications = Certification::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Certifications retrieved successfully.',
            'data' => $certifications,
        ]);
    }

    /**
     * Store a new certification.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'organization' => [
                'required',
                'string',
                'max:255',
            ],

            'credential_id' => [
                'nullable',
                'string',
                'max:255',
            ],

            'credential_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            'issue_date' => [
                'required',
                'date_format:Y-m-d',
            ],

            'expiry_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:issue_date',
            ],

            'no_expiry' => [
                'required',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:Active,Expired',
            ],
        ]);

        // If certification has no expiration,
        // make sure expiry_date is NULL.
        if ($validated['no_expiry']) {
            $validated['expiry_date'] = null;
        }

        $certification = Certification::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certification created successfully.',
            'data' => $certification,
        ], 201);
    }

    /**
     * Display one certification.
     */
    public function show(
        Certification $certification
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => 'Certification retrieved successfully.',
            'data' => $certification,
        ]);
    }

    /**
     * Update certification.
     */
    public function update(
        Request $request,
        Certification $certification
    ): JsonResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'organization' => [
                'required',
                'string',
                'max:255',
            ],

            'credential_id' => [
                'nullable',
                'string',
                'max:255',
            ],

            'credential_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            'issue_date' => [
                'required',
                'date_format:Y-m-d',
            ],

            'expiry_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:issue_date',
            ],

            'no_expiry' => [
                'required',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:Active,Expired',
            ],
        ]);

        // If no expiration is selected,
        // save expiry_date as NULL.
        if ($validated['no_expiry']) {
            $validated['expiry_date'] = null;
        }

        $certification->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certification updated successfully.',
            'data' => $certification->fresh(),
        ]);
    }

    /**
     * Delete certification.
     */
    public function destroy(
        Certification $certification
    ): JsonResponse {
        $certification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification deleted successfully.',
        ]);
    }
}