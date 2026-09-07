<?php
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContectController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class,'index']);
Route::post('/save',[HomeController::class,'save']);
Route::get('/edit/{id}',[HomeController::class,'edit'])->name('edit');

Route::get('about', [AboutController::class,'index']);

Route::get('contect',[ContectController::class,'index']);
