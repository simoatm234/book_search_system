<?php

namespace App\Console\Commands;

use App\Jobs\ProcessBookOCRJob;
use App\Models\book_files;
use App\Models\BookPages;
use Illuminate\Console\Command;

class StartProcessingBooks extends Command
{
    protected $signature = 'app:start-processing-books';
    protected $description = 'Dispatch OCR jobs for all book files';

    public function handle()
    {
        $bookFiles = book_files::all();

        foreach ($bookFiles as $file) {
            // Check if pages already exist for this book
            $checkBookPagesExist = BookPages::where('book_id', $file->book_id)->exists();

            if ($checkBookPagesExist) {
                $this->info("Book ID {$file->book_id} already has pages in DB. Skipping.");
                continue; 
            }

            // Dispatch the OCR job for the book content
            ProcessBookOCRJob::dispatch($file->book_id, $file->file_path, $file->file_format);

            $this->info("Dispatched OCR job for Book ID {$file->book_id}");
        }

        $this->info('All OCR jobs dispatched!');
    }
}
