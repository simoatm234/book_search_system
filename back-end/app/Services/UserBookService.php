<?php

namespace App\Services;

use App\Models\UserBook;
use Illuminate\Support\Facades\Log;

class UserBookService
{
    /**
     * Get all user books
     */
    public function allUserBooks()
    {
        return UserBook::with(['user', 'book'])
            ->orderBy('action_at', 'desc')
            ->get();
    }

    /**
     * Get user books by user ID
     */
    public function getUserBooks($userId)
    {
        return UserBook::where('user_id', $userId)
            ->with('book')
            ->orderBy('action_at', 'desc')
            ->get();
    }

    /**
     * Get user books by book ID
     */
    public function getBookUsers($bookId)
    {
        return UserBook::where('book_id', $bookId)
            ->with('user')
            ->orderBy('action_at', 'desc')
            ->get();
    }

    /**
     * Track read action
     */
    public function trackRead($userId, $bookId)
    {
        return UserBook::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'action' => 'read',
            'action_at' => now(),
        ]);
    }

    /**
     * Track download action
     */
    public function trackDownload($userId, $bookId)
    {
        return UserBook::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'action' => 'downloaded',
            'action_at' => now(),
        ]);
    }
}
