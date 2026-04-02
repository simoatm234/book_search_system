<?php

namespace App\Services;

use App\Jobs\ProcessBookOCRJob;
use App\Models\Book;
use App\Models\book_files;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class BookFilesService
{
    /**
     * Get all book files
     */
    public function allBooksFiles()
    {
        return book_files::all();
    }

    /**
     * Download book content and cover image
     */
    public function downloadBooks($bookId, $contentUrl, $coverUrl = null)
    {
        $book = Book::find($bookId);

        if (!$book) {
            Log::error("Book not found: {$bookId}");
            return;
        }

        try {
            $contentPath = null;
            $coverPath = null;

            // Download book content 
            if ($contentUrl) {
                $contentPath = $this->downloadContent($book, $contentUrl);
            }

            // Download cover image
            if ($coverUrl) {
                $coverPath = $this->downloadCover($book, $coverUrl);
            }

            // Save to database
            if ($contentPath) {
                book_files::create([
                    'book_id' => $book->id,
                    'file_path' => $contentPath,
                    'file_format' => $this->getFormat($contentUrl),
                    'cover_path' => $coverPath,
                    'downloaded_at' => now(),
                ]);


                Log::info("✓ Downloaded: {$book->title} (Content: {$contentPath}, Cover: " . ($coverPath ?? 'none') . ")");
            } else {
                Log::error("✗ Failed to download content for: {$book->title}");
            }
        } catch (\Exception $e) {
            Log::error("✗ Error downloading {$book->title}: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Download book content file to storage/app/public
     */
    private function downloadContent($book, $contentUrl)
    {
        try {
            $response = Http::timeout(120)->get($contentUrl);

            if ($response->successful()) {
                $format = $this->getFormat($contentUrl);
                $extension = $this->getExtension($format);
                $filename = "books/{$book->id}.{$extension}";

                // Save to storage/app/public/books
                Storage::disk('public')->put($filename, $response->body());

                // Verify file was saved
                if (!Storage::disk('public')->exists($filename)) {
                    Log::error("File not saved: {$filename}");
                    return null;
                }

                $fileSize = Storage::disk('public')->size($filename);
                Log::info("Downloaded content: {$filename} ({$fileSize} bytes)");

                return $filename;
            }

            Log::error("Failed to download content from: {$contentUrl} - HTTP {$response->status()}");
            return null;
        } catch (\Exception $e) {
            Log::error("Exception downloading content: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Download cover image to storage/app/public
     */
    private function downloadCover($book, $coverUrl)
    {
        try {
            $response = Http::timeout(60)->get($coverUrl);

            if ($response->successful()) {
                $filename = "covers/{$book->id}.jpg";

                // Save to storage/app/public/covers
                Storage::disk('public')->put($filename, $response->body());

                // Verify file was saved
                if (!Storage::disk('public')->exists($filename)) {
                    Log::warning("Cover not saved: {$filename}");
                    return null;
                }

                Log::info("Downloaded cover: {$filename}");
                return $filename;
            }

            Log::warning("Failed to download cover from: {$coverUrl} - HTTP {$response->status()}");
            return null;
        } catch (\Exception $e) {
            Log::warning("Exception downloading cover: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Determine format from URL
     */
    private function getFormat($url)
    {
        if (str_contains($url, '.epub')) return 'epub';
        if (str_contains($url, '.txt')) return 'txt';
        if (str_contains($url, '.html')) return 'html';
        return 'unknown';
    }

    /**
     * Get file extension from format
     */
    private function getExtension($format)
    {
        return match ($format) {
            'epub' => 'epub',
            'txt' => 'txt',
            'html' => 'html',
            default => 'txt',
        };
    }

    /**
     * Delete book file from storage
     */
    public function deleteBookFile($bookFileId)
    {
        $bookFile = book_files::find($bookFileId);

        if (!$bookFile) {
            Log::error("Book file not found: {$bookFileId}");
            return false;
        }

        try {
            // Delete content file from storage/app/public
            if ($bookFile->file_path && Storage::disk('public')->exists($bookFile->file_path)) {
                Storage::disk('public')->delete($bookFile->file_path);
            }

            // Delete cover file from storage/app/public
            if ($bookFile->cover_path && Storage::disk('public')->exists($bookFile->cover_path)) {
                Storage::disk('public')->delete($bookFile->cover_path);
            }

            // Delete database record
            $bookFile->delete();

            Log::info("✓ Deleted book file: {$bookFileId}");
            return true;
        } catch (\Exception $e) {
            Log::error("✗ Error deleting book file {$bookFileId}: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Get book file by book ID
     */
    public function getBookFileByBookId($bookId)
    {
        return book_files::where('book_id', $bookId)->first();
    }

    /**
     * Check if book has files
     */
    public function hasFiles($bookId)
    {
        return book_files::where('book_id', $bookId)->exists();
    }
}
