<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Store a new contact message
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'max:150',
            ],

            'subject' => [
                'nullable',
                'string',
                'max:200',
            ],

            'message' => [
                'required',
                'string',
                'min:5',
            ],
        ]);

        $message = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
            'status' => 'unread',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.',
            'data' => $message,
        ], 201);
    }


    /**
     * Get all contact messages
     */
    public function index(): JsonResponse
    {
        $messages = Message::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }


    /**
     * Show single message
     */
    public function show(Message $message): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }


    /**
     * Mark message as read
     */
    public function markAsRead(Message $message): JsonResponse
    {
        $message->update([
            'status' => 'read',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read.',
            'data' => $message,
        ]);
    }


    /**
     * Delete message
     */
    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully.',
        ]);
    }
}