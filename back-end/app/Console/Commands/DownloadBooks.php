<?php

namespace App\Console\Commands;

use App\Jobs\DownloadBookJob;
use App\Models\Book;
use Illuminate\Console\Command;

class DownloadBooks extends Command
{
    protected $signature = 'app:download-books';
    protected $description = 'Download book content and cover images';

    public function handle()
    {
        // Get books that don't have files yet
        $books = Book::doesntHave('files')->get();

        if ($books->isEmpty()) {
            $this->info("✓ All books already have files!");
            return;
        }

        $this->info("Found {$books->count()} books without files");

        $queued = 0;
        $skipped = 0;

        foreach ($books as $book) {
            $formats = $book->formats;

            // Get book content URL
            $contentUrl = $this->findContentUrl($formats);

            // Get cover image URL
            $coverUrl = $this->findCoverUrl($formats);

            if ($contentUrl) {
                // Dispatch job with both URLs
                DownloadBookJob::dispatch($book->id, $contentUrl, $coverUrl);
                $this->info("✓ Queued: {$book->title}");
                $queued++;
            } else {
                $this->warn("✗ Skipped: {$book->title} (no content available)");
                $skipped++;
            }
        }

        $this->info("\n📊 Summary:");
        $this->info("✓ Queued: {$queued}");
        $this->warn("⊘ Skipped: {$skipped}");
        $this->info("All done!");
    }

    /**
     * Find the best content URL (EPUB, TXT, or HTML)
     */
    private function findContentUrl($formats)
    {
        // Try plain text second
        if (isset($formats['text/plain; charset=utf-8'])) {
            return $formats['text/plain; charset=utf-8'];
        }
        // Try EPUB first (best format)
        if (isset($formats['application/epub+zip'])) {
            return $formats['application/epub+zip'];
        }

        

        // Try HTML last
        if (isset($formats['text/html'])) {
            return $formats['text/html'];
        }

        return null;
    }

    /**
     * Find the cover image URL
     */
    private function findCoverUrl($formats)
    {
        // Look for JPEG cover image
        if (isset($formats['image/jpeg'])) {
            return $formats['image/jpeg'];
        }

        return null;
    }
}
