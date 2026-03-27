<?php

namespace App\Http\Controllers;

use App\Models\saveBooks;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Services\SaveBookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SaveBooksController extends Controller
{
    protected SaveBookService $saveBooks;

    public function __construct(SaveBookService $saveBooks)
    {
        $this->saveBooks = $saveBooks;
    }

    /**
     * Display a listing of all saved books (admin only).
     */
    public function index(Request $request)
    {
        // Optional: add admin middleware check
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $saves = $this->saveBooks->allSaves();
        return response()->json([
            'success' => true,
            'data' => $saves,
        ], 200);
    }

    /**
     * Display the current user's saved books.
     */
    public function mySaves(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $saves = $this->saveBooks->mySaves($user->id);
        return response()->json([
            'success' => true,
            'data' => $saves,
        ], 200);
    }

    /**
     * Store a newly created resource in storage (save a book for the current user).
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'book_id' => 'required|exists:books,id',
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            $book = Book::find($validated['book_id']);
            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found.',
                ], 404);
            }

            $data = [
                'user_id' => $user->id,
                'book_id' => $book->id,
            ];

            // Use the service to save (it will handle duplicate/soft-delete)
            $saved = $this->saveBooks->store($data);

            return response()->json([
                'success' => true,
                'message' => 'Book saved successfully.',
                'data' => $saved->load('book'),
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save book.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified saved book (owner only).
     */
    public function show(saveBooks $saveBooks)
    {
        try {
            // Check authorization: owner or admin can view
            if (Auth::id() !== $saveBooks->user_id && Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $saveBooks->load('book'),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch saved book.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage (soft delete) – owner only.
     */
    public function destroy(saveBooks $saveBooks)
    {
        try {
            // Check authorization: only the owner can delete
            if (Auth::id() !== $saveBooks->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }

            $this->saveBooks->delete($saveBooks);

            return response()->json([
                'success' => true,
                'message' => 'Book removed from saved list.',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove book.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
