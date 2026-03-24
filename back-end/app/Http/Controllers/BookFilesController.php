<?php

namespace App\Http\Controllers;

use App\Models\book_files;
use App\Http\Controllers\Controller;
use App\Services\BookFilesService;
use Illuminate\Http\Request;

class BookFilesController extends Controller
{
    public BookFilesService $bookFilesService;
    public function __construct(BookFilesService $bookFilesService) {
        $this->bookFilesService = $$bookFilesService;
    }
    public function index()
    {
        $book_files = $this->bookFilesService->allBooksFiles();
        return   response()->json([
            'success' => true,
            'message' => ' books files retrived successfuly',
            'data' => $book_files
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
    public function show(book_files $book_files)
    {
        return   response()->json([
            'success' => true,
            'message' => ' book files retrived successfuly',
            'data' => $book_files
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, book_files $book_files)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(book_files $book_files)
    {
        //
    }
}
