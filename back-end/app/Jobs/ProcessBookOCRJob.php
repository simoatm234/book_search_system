<?php

namespace App\Jobs;

use App\Services\BookPagesService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessBookOCRJob implements ShouldQueue
{
    use Queueable;
    protected $bookId ; 
    protected $bookFilePath ; 
    protected $bookfileFormat; 

    /**
     * Create a new job instance.
     */
    public function __construct($bookId,$bookFilePath,$bookfileFormat)
    {
        $this->bookId = $bookId;
        $this->bookFilePath = $bookFilePath;
        $this->bookfileFormat = $bookfileFormat;
    }

    /**
     * Execute the job.
     */
    public function handle(BookPagesService $bookPagesService): void
    {
            $bookPagesService->storeContent($this->bookId, $this->bookFilePath , $this->bookfileFormat);
    }
}
