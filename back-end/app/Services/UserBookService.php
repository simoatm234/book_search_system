<?php

namespace App\Services;

use App\Models\UserBook;
use Illuminate\Support\Facades\Log;

class UserBookService
{
    /**
     * Get all user books with pagination.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function allUserBooks($perPage = 15)
    {
        return UserBook::with(['user', 'book'])
            ->orderBy('action_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get user books by user ID with pagination.
     *
     * @param int $userId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getUserBooks($userId, $perPage = 15)
    {
        return UserBook::where('user_id', $userId)
            ->with('book')
            ->orderBy('action_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get users who have interacted with a book with pagination.
     *
     * @param int $bookId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getBookUsers($bookId, $perPage = 15)
    {
        return UserBook::where('book_id', $bookId)
            ->with('user')
            ->orderBy('action_at', 'desc')
            ->paginate($perPage);
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
