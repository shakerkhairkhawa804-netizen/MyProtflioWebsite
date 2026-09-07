<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\MessageController;


/*
|--------------------------------------------------------------------------
| Contact Messages API
|--------------------------------------------------------------------------
*/

Route::post('/messages', [
    MessageController::class,
    'store'
]);

Route::get('/messages', [
    MessageController::class,
    'index'
]);

Route::get('/messages/{message}', [
    MessageController::class,
    'show'
]);

Route::patch('/messages/{message}/read', [
    MessageController::class,
    'markAsRead'
]);

Route::delete('/messages/{message}', [
    MessageController::class,
    'destroy'
]);
Route::apiResource(
    'certifications',
    CertificationController::class
);
Route::apiResource(
    'educations',
    EducationController::class
);
Route::apiResource(
    'experiences',
    ExperienceController::class
);

Route::apiResource('skills', SkillController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource(
    'projects',
    ProjectController::class
);
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Login API
Route::post('/login', [LoginController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Authenticated User
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => $request->user()
    ]);
});