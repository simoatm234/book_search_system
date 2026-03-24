<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\book_files;
use App\Models\User;
use Illuminate\Http\Request;

class DashBoardController extends Controller
{
    public function dashboard()
    {
        try {
            $totalUsers = User::count();
            $totalBooks = Book::count();
            $totalDownloads = Book::sum('download_count');
            $totalReading = Book::sum('reading_count');

            // Most read book
            $mostReadBook = Book::orderBy('reading_count', 'desc')->first();

            // Most downloaded book
            $mostDownloadedBook = Book::orderBy('download_count', 'desc')->first();

            // Recent 5 books
            $recentBooks = Book::latest()->take(5)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalUsers' => $totalUsers,
                    'totalBooks' => $totalBooks,
                    'totalDownloads' => $totalDownloads,
                    'totalReading' => $totalReading,
                    'mostReadBook' => $mostReadBook,
                    'mostDownloadedBook' => $mostDownloadedBook,
                    'recentBooks' => $recentBooks,
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
