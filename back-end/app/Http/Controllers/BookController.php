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
    public function booksBySubject(Request $request)
    {
        $validate = $request->validate(['subject' => 'required|string|min:1']);

        try {
            $books = Book::whereJsonContains('subjects', $validate['subject'])
                ->with('files')
                ->paginate(20);

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

    public function getAllSubjects()
    {
        $allSubjects = [];

        Book::chunk(1000, function ($books) use (&$allSubjects) {
            foreach ($books as $book) {
                $subjects = $book->subjects;

                // If it's a string, try to decode as JSON, otherwise treat as single subject
                if (is_string($subjects)) {
                    $decoded = json_decode($subjects, true);
                    if (is_array($decoded)) {
                        $subjects = $decoded;
                    } else {
                        $subjects = [$subjects]; // convert single subject to array
                    }
                }

                if (is_array($subjects)) {
                    foreach ($subjects as $subject) {
                        if ($subject && !in_array($subject, $allSubjects)) {
                            $allSubjects[] = $subject;
                        }
                    }
                }
            }
        });

        return response()->json(['subjects' => $allSubjects]);
    }
}
