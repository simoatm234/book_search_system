<?php

use App\Http\Controllers\authUserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookFilesController;
use App\Http\Controllers\BooksSubjectController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\SaveBooksController;
use App\Http\Controllers\UserActionsController;
use App\Http\Controllers\UserBookController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//user router

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('user')->group(function(){
        Route::get('/all', [UserController::class, 'index']);
        Route::get('/all/trashed', [UserController::class, 'indexTrashedUsers']);
        Route::put('/update/{user}', [UserController::class, 'update']);
        Route::put('/updatePass/{user}', [UserController::class, 'updatePass']);
        Route::delete('/forceDelete/{user}', [UserController::class, 'destroy']);
        Route::delete('/delete/{user}', [UserController::class, 'softDelete']);
        Route::post('/restore/{id}', [UserController::class, 'restore']);
        Route::get('/me', [authUserController::class, 'me']);
        Route::post('/logout/{user}', [authUserController::class, 'logout']);
        Route::get('/actions', [UserActionsController::class, 'index']);
        // saves
        Route::get('books/AllSaves', [SaveBooksController::class, 'index']);
        Route::get('books/my-saves', [SaveBooksController::class, 'mySaves']);
        Route::post('books/saves', [SaveBooksController::class, 'store']);
        Route::get('books/saves/{saveBooks}', [SaveBooksController::class, 'show']);
        Route::delete('books/saves/{saveBooks}', [SaveBooksController::class, 'destroy']);
    });
    
    Route::prefix('books')->group(function () {
        Route::get('/user-books', [UserBookController::class, 'index']);
        // Track actions
        Route::post('/user-books/track-read/{bookId}', [UserBookController::class, 'trackRead']);
        Route::post('/user-books/track-download/{bookId}', [UserBookController::class, 'trackDownload']);
    });
  
    Route::prefix('booksFiles')->group(function () {
        Route::get('/all' , [BookFilesController::class , 'index']);
        Route::get('/show/{book_files}' , [BookFilesController::class , 'show']);
        Route::get('/file/{filename}', [BookController::class, 'getFile']);
    });
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


Route::prefix('books')->group(function () {
    Route::get('/all', [BookController::class, 'index']);
    Route::get('/show/{book}', [BookController::class, 'show']);
    Route::get('/subjects', [BookController::class, 'booksOrSubjects']);   
    Route::get('/subject', [BookController::class, 'booksOrSubjects']);
});
