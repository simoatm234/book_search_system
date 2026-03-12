<?php

use App\Http\Controllers\authUserController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\UserActionsController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//user router

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
        Route::get('/all', [UserController::class, 'index']);
        Route::put('/update/{user}', [UserController::class, 'update']);
        Route::put('/updatePass/{user}', [UserController::class, 'updatePass']);
        Route::delete('/delete/{user}', [UserController::class, 'destroy']);
        Route::get('/me', [authUserController::class, 'me']);
        Route::post('/logout/{user}', [authUserController::class, 'logout']);
        Route::get('/actions', [UserActionsController::class, 'index']);
    });
Route::prefix('/user')->group(function (){
    Route::post('/store',[UserController::class , 'store']);
    Route::get('/show/{user}', [UserController::class, 'show']); 
    Route::post('/login', [authUserController::class, 'login']);
    Route::get('/resend-email-confirmation', [EmailController::class, 'resendConfirmation']);
    Route::get('/confirm-email', [EmailController::class, 'Confirmation']);
    // password reset
    Route::post('/check-email', [authUserController::class, 'check_email']);
    Route::post('/send-reset-code', [EmailController::class, 'send_reset_code']);
    Route::post('/confirme-code-reset-pass', [EmailController::class, 'confirme_code_reset_pass']);
    Route::post('/reset-password', [authUserController::class, 'resetPassword']);
});
