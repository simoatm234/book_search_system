<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\UserBookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserBookController extends Controller
{
    protected $userBookService;

    public function __construct(UserBookService $userBookService)
    {
        $this->userBookService = $userBookService;
    }

    /**
     * Get all user books
     */
    public function index()
    {
        try {
            $userBooks = $this->userBookService->allUserBooks();

            return response()->json([
                'success' => true,
                'message' => 'User books retrieved successfully',
                'data' => $userBooks,
                'count' => $userBooks->count(),
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error fetching user books: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user books',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    

    /**
     * Track read action
     */
    public function trackRead(Request $request)
    {
        $request->validate([
            'book_Id' => 'required|exists:books,id',
        ]);

        try {
            $userBook = $this->userBookService->trackRead(
                auth()->id(),
                $request->book_id
            );

            return response()->json([
                'success' => true,
                'message' => 'Book read tracked successfully',
                'data' => $userBook,
            ], 201);
        } catch (\Throwable $th) {
            Log::error('Error tracking read: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to track read',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Track download action
     */
    public function trackDownload(Request $request ,$bookId)
    {
        try {
            // 1. Check book
            $book = Book::findOrFail($bookId);

            // 2. Get file (adjust relation حسب مشروعك)
            $file = $book->files()->first();

            if (!$file || !$file->file_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found',
                ], 404);
            }

            // 3. Track download
            $this->userBookService->trackDownload(
                auth()->id(),
                $bookId
            );

            // 4. Return file
            $path = storage_path('app/public/' . $file->file_path);

            if (!file_exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found in storage',
                ], 404);
            }

            return response()->download($path, basename($path));
        } catch (\Throwable $th) {
            \Log::error('Download error: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Download failed',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    
}
