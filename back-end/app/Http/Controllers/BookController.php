<?php

namespace App\Http\Controllers;

use App\Models\book;
use App\Http\Controllers\Controller;
use App\Services\BooksService;
use Illuminate\Http\Request;

class BookController extends Controller
{
protected BooksService $booksService;
public function __construct(BooksService $booksService)
{
    $this->booksService = $booksService;
}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = $this->booksService->allBooks();
        return   response()->json([
            'success' => true,
            'message' => ' books retrived successfuly',
            'data' => $books
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(book $book)
    {
        $book->load('files');
        return   response()->json([
            'success' => true,
            'message' => ' book retrived successfuly',
            'data' => $book
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, book $book)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(book $book)
    {
        //
    }


    // Simple version - returns all books with all fields
    public function booksOrSubjects(Request $request)
    {
        $subject = $request->input('subject');
        $limit = (int) $request->input('limit', 12); 

        // If no subject parameter, return all subjects with limited books per subject
        if (is_null($subject)) {
            $booksBySubject = [];
            $subjectCounts = []; // track how many books per subject we've added

            Book::with('files')->chunk(1000, function ($books) use (&$booksBySubject, &$subjectCounts, $limit) {
                foreach ($books as $book) {
                    $subjects = $book->subjects;

                    // Normalize to array
                    if (is_string($subjects)) {
                        $decoded = json_decode($subjects, true);
                        $subjects = is_array($decoded) ? $decoded : [$subjects];
                    }

                    if (is_array($subjects)) {
                        foreach ($subjects as $subjectName) {
                            if (empty($subjectName)) continue;

                            // Skip if we already have enough books for this subject
                            if (($subjectCounts[$subjectName] ?? 0) >= $limit) {
                                continue;
                            }

                            // Add the book and increment the count
                            $booksBySubject[$subjectName][] = $book;
                            $subjectCounts[$subjectName] = ($subjectCounts[$subjectName] ?? 0) + 1;
                        }
                    }
                }
            });

            return response()->json([
                'success' => true,
                'subjects' => $booksBySubject
            ]);
        }

        // Subject provided: return paginated books for that subject
        $validated = $request->validate(['subject' => 'required|string|min:1']);

        try {
            $books = Book::whereJsonContains('subjects', $validated['subject'])
                ->with('files')
                ->paginate(12);

            if ($books->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No books found for this subject.',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'success' => true,
                'data' => $books
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch books',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function searchWithSubject()  {
        
    }
}
