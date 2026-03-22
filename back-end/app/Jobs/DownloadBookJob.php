<?php

namespace App\Jobs;

use App\Services\BookFilesService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DownloadBookJob implements ShouldQueue
{
    use Queueable;

    public $bookId;
    public $contentUrl;
    public $coverUrl;

    /**
     * Create a new job instance.
     */
    public function __construct($bookId, $contentUrl, $coverUrl = null)
    {
        $this->bookId = $bookId;
        $this->contentUrl = $contentUrl;
        $this->coverUrl = $coverUrl;
    }

    /**
     * Execute the job.
     */
    public function handle(BookFilesService $bookFilesService): void
    {
        $bookFilesService->downloadBooks($this->bookId, $this->contentUrl, $this->coverUrl);
    }
}
