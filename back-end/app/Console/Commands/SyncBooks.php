<?php

namespace App\Console\Commands;

use App\Jobs\GetBooksFromApis;
use Illuminate\Console\Command;

class SyncBooks extends Command
{
    protected $signature = 'books:sync';

    protected $description = 'Sync books from OpenLibrary';

    public function handle()
    {

        $subjects = config('books.subjects');

        foreach ($subjects as $subject) {

            GetBooksFromApis::dispatch($subject);
        }

        $this->info("Books import jobs dispatched!");
    }
}
