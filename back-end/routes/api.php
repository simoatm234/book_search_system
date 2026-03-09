<?php

use App\Http\Controllers\authUserController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//user router

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
        Route::get('/all', [UserController::class, 'index']);
        Route::put('/update/{user}', [UserController::class, 'update']);
        Route::delete('/delete/{user}', [UserController::class, 'destroy']);
        Route::post('/logout/{user}', [authUserController::class, 'logout']);
    });
Route::prefix('/user')->group(function (){
    Route::post('/store',[UserController::class , 'store']);
    Route::get('/show/{user}', [UserController::class, 'show']); 
    Route::post('/login', [authUserController::class, 'login']);
    Route::get('/resend-email-confirmation', [EmailController::class, 'resendConfirmation']);
    Route::get('/confirm-email', [EmailController::class, 'Confirmation']);
});
