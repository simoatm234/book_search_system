<?php

namespace App\Jobs;

use App\Services\BooksService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GetBooksFromApis implements ShouldQueue
{
    use Queueable;
    protected $subject;

    /**
     * Create a new job instance.
     */
    public function __construct($subject)
    {
        $this->subject = $subject;
    }

    /**
     * Execute the job.
     */
    public function handle(BooksService $booksService): void
    {
        $booksService->importBySubject($this->subject, 500);
    }
}
