<?php

namespace App\Http\Controllers;

use App\Models\searchBook;
use App\Http\Controllers\Controller;
use App\Services\BookPagesService;
use Illuminate\Http\Request;

class SearchBookController extends Controller
{
protected $bookPagesService;
    public function __construct(BookPagesService $bookPagesService) {
        $this->bookPagesService = $bookPagesService;
    }

    public function search(Request $request)
    {
        try {
            $validated = $request->validate([
                'query'   => 'required|string|min:1',
                'type'    => 'nullable|string|in:all,author,content,title',
            ]);

            $query   = $validated['query'];
            $type    = $validated['type'] ?? 'all';

            $result = $this->bookPagesService->search($query, $type);

            return response()->json([
                'success' => true,
                'count'   => $result->count(),
                'data'    => $result,
            ]);
        } catch (\Throwable $th) {
            \Log::error("Search error: " . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error during search',
            ], 500);
        }
    }
    public function searchBySubjct(Request $request)
    {
        try {
            $validated = $request->validate([
                'query'   => 'required|string|min:1',
                'type'    => 'nullable|string|in:all,author,content,title',
                'subject' => 'required|string'
            ]);

            $query   = $validated['query'];
            $type    = $validated['type'] ?? 'all';
            $subject = $validated['subject'] ;

            $result = $this->bookPagesService->searchBySubject($query, $subject,  $type);

            return response()->json([
                'success' => true,
                'count'   => $result->count(),
                'data'    => $result,
            ]);
        } catch (\Throwable $th) {
            \Log::error("Search error: " . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error during search',
            ], 500);
        }
    }
}
