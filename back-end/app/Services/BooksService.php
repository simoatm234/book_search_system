<?php

namespace App\Services;

use App\Models\Book;
use App\Models\book_files;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BooksService
{
    private const API = 'https://gutendex.com/books';

    public function allBooks()  {
        return Book::with('files')->get();
    }
    /**
     * Import books by subject/topic
     */
    public function importBySubject(string $subject, int $limit = 1000)
    {
        $imported = 0;
        $skipped = 0;
        $errors = 0;
        $page = 1;

        echo "Starting import for subject: {$subject}\n";

        while ($imported < $limit) {
            try {
                $response = Http::timeout(30)->get(self::API, [
                    'topic' => $subject,
                    'page' => $page
                ]);

                if (!$response->successful()) {
                    echo "API request failed: " . $response->status() . "\n";
                    break;
                }

                $data = $response->json();
                $books = $data['results'] ?? [];

                if (empty($books)) {
                    echo "No more books found\n";
                    break;
                }

                foreach ($books as $bookData) {
                    if ($imported >= $limit) break;

                    $result = $this->importSingleBook($bookData);

                    if ($result === 'imported') {
                        $imported++;
                        echo "✓ Imported: " . ($bookData['title'] ?? 'Unknown') . "\n";
                    } elseif ($result === 'skipped') {
                        $skipped++;
                        echo "⚠ Skipped: " . ($bookData['title'] ?? 'Unknown') . "\n";
                    } else {
                        $errors++;
                        echo "✗ Error: " . ($bookData['title'] ?? 'Unknown') . "\n";
                    }
                }

                $page++;
                echo "Progress: Imported={$imported}, Skipped={$skipped}, Errors={$errors}\n";
                sleep(1);
            } catch (\Throwable $e) {
                $errors++;
                Log::error("Error importing books for {$subject}: " . $e->getMessage());
            }
        }

        echo "\n✅ Import completed for '{$subject}'!\n";
        echo "Final stats: Imported={$imported}, Skipped={$skipped}, Errors={$errors}\n\n";

        return compact('imported', 'skipped', 'errors');
    }

    /**
     * Import single book
     */
    public function importSingleBook(array $data)
    {
        try {
            $title = $data['title'] ?? null;
            if (!$title) return 'skipped';

            $gutendexId = $data['id'] ?? null;
            if (!$gutendexId) return 'skipped';

            // Skip duplicates
            if ($this->bookExists($gutendexId)) return 'skipped';

            Book::create([
                'title' => $title,
                'summaries' => isset($data['summaries']) ? implode("\n", $data['summaries']) : null,
                'authors' => array_map(fn($a) => $a['name'] ?? 'Unknown', $data['authors'] ?? []),
                'translators' => array_map(fn($t) => $t['name'] ?? 'Unknown', $data['translators'] ?? []),
                'bookshelves' => $data['bookshelves'] ?? [],
                'subjects' => $data['subjects'] ?? [],
                'languages' => $data['languages'] ?? ['en'],
                'media_type' => $data['media_type'] ?? null,
                'formats' => $data['formats'] ?? [],
                'download_count' =>  0,
                'gutendex_id' => $gutendexId,
            ]);

            return 'imported';
        } catch (\Throwable $e) {
            Log::error('Error importing single book', [
                'title' => $data['title'] ?? 'Unknown',
                'error' => $e->getMessage()
            ]);
            return 'error';
        }
    }

    /**
     * Check if book already exists
     */
    private function bookExists(int $gutendexId): bool
    {
        return DB::table('books')->where('gutendex_id', $gutendexId)->exists();
    }



}
