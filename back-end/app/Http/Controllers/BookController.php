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
            'data' => $book6
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
}
