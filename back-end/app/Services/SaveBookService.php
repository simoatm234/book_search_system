<?php

namespace App\Services;

use App\Models\saveBooks;
use Illuminate\Support\Facades\Auth;

class SaveBookService
{
    /**
     * Get all saved books with user and book relations (admin only).
     */
    public function allSaves()
    {
        return saveBooks::with(['user', 'book'])->get();
    }

    /**
     * Get saved books for a specific user with book details.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function mySaves($userId)
    {
        return saveBooks::with('book')
            ->where('user_id', $userId)
            ->get();
    }

    /**
     * Store a new saved book record.
     * If a soft‑deleted record exists, it will be restored.
     *
     * @param array $data
     * @return saveBooks
     */
    public function store(array $data)
    {
        // Check for existing record (including soft‑deleted)
        $existing = saveBooks::withTrashed()
            ->where('user_id', $data['user_id'])
            ->where('book_id', $data['book_id'])
            ->first();

        if ($existing && $existing->trashed()) {
            $existing->restore();
            return $existing;
        }

        if ($existing) {
            // Already active, no change needed
            return $existing;
        }

        return saveBooks::create([
            'user_id' => $data['user_id'],
            'book_id' => $data['book_id'],
        ]);
    }

    /**
     * Soft‑delete a saved book record.
     *
     * @param saveBooks $saveBook
     * @return bool|null
     */
    public function delete(saveBooks $saveBook)
    {
        return $saveBook->delete();
    }
}
