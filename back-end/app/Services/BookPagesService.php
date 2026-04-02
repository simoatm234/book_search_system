<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BookPage;
use App\Models\BookPages;
use Illuminate\Support\Facades\Storage;
use thiagoalessio\TesseractOCR\TesseractOCR; // make sure tesseract-ocr package is installed

class BookPagesService
{
    /**
     * Get all pages for a book
     */
    public function getPagesByBook($bookId)
    {
        return BookPages::where('book_id', $bookId)->orderBy('page_number')->get();
    }

    public function search($query, $type = 'all')
    {
        $searchQuery = BookPages::with('book');

        return $this->applyTypeFilter($searchQuery, $query, $type)
            ->limit(50)
            ->get();
    }

    public function searchBySubject($query, $subject, $type = 'all')
    {
        $searchQuery = BookPages::with('book')
            ->whereHas(
                'book',
                fn($q) =>
                $q->where('subjects', 'like', "%{$subject}%")
            );

        return $this->applyTypeFilter($searchQuery, $query, $type)
            ->limit(50)
            ->get();
    }

    private function applyTypeFilter($searchQuery, $query, $type)
    {
        if ($type === 'content') {
            $searchQuery->where('content', 'like', "%{$query}%");
        } elseif ($type === 'title') {
            $searchQuery->whereHas(
                'book',
                fn($q) => $q->where('title', 'like', "%{$query}%")
            );
        } elseif ($type === 'author') {
            $searchQuery->whereHas(
                'book',
                fn($q) => $q->where('authors', 'like', "%{$query}%")
            );
        } else {
            $searchQuery->where(function ($q) use ($query) {
                $q->where('content', 'like', "%{$query}%")
                    ->orWhereHas('book', fn($q2) => $q2->where('title', 'like', "%{$query}%"))
                    ->orWhereHas('book', fn($q3) => $q3->where('authors', 'like', "%{$query}%"));
            });
        }

        
        return $searchQuery;
    }
    /**
     * Store book content into pages
     */
    public function storeContent($bookId, $bookFile, $fileFormat)
    {
        $book = Book::find($bookId);
        if (!$book || !Storage::disk('public')->exists($bookFile)) return null;

        $content = '';

        switch ($fileFormat) {
            case 'txt':
                $content = Storage::disk('public')->get($bookFile);
                break;

            case 'html':
                $html = Storage::disk('public')->get($bookFile);
                $content = $this->extractTextFromHtml($html);

                // Check for images in HTML and OCR them
                $imagesOcrText = $this->extractImagesFromHtmlAndOcr($html);
                $content .= " " . $imagesOcrText;
                break;

            case 'epub':
                $content = $this->extractTextFromEpub($bookFile);
                // Also run OCR on images inside EPUB
                $imagesOcrText = $this->extractImagesFromEpubAndOcr($bookFile);
                $content .= " " . $imagesOcrText;
                break;

            default:
                break;
        }

        if (!$content) return null;

        // Split content into pages
        $pages = $this->splitContentIntoPages($content);

        foreach ($pages as $index => $pageContent) {
            $this->makeBookPage($bookId, $index + 1, $pageContent);
        }

        return true;
    }

    /**
     * Split content into pages (default 1500 chars)
     */
    public function splitContentIntoPages($content, $charsPerPage = 1500)
    {
        return str_split($content, $charsPerPage);
    }

    /**
     * Extract text from HTML
     */
    private function extractTextFromHtml($html)
    {
        $html = preg_replace('/<script.*?<\/script>/is', '', $html);
        $html = preg_replace('/<style.*?<\/style>/is', '', $html);
        $text = strip_tags($html);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    /**
     * OCR images inside HTML
     */
    private function extractImagesFromHtmlAndOcr($html)
    {
        $ocrText = '';

        // Match all <img> tags
        preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $imgSrc) {
                $path = $this->resolveImagePath($imgSrc);
                if ($path && Storage::disk('public')->exists($path)) {
                    $ocrText .= ' ' . $this->runTesseract(Storage::disk('public')->path($path));
                }
            }
        }

        return trim($ocrText);
    }

    /**
     * Extract text from EPUB
     */
    private function extractTextFromEpub($bookFile)
    {
        $text = '';
        $zipPath = Storage::disk('public')->path($bookFile);

        $zip = new \ZipArchive();
        if ($zip->open($zipPath) === true) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if (str_ends_with($name, '.html') || str_ends_with($name, '.xhtml')) {
                    $fileContent = $zip->getFromIndex($i);
                    $text .= ' ' . $this->extractTextFromHtml($fileContent);
                }
            }
            $zip->close();
        }

        return trim($text);
    }

    /**
     * OCR images inside EPUB
     */
    private function extractImagesFromEpubAndOcr($bookFile)
    {
        $ocrText = '';
        $zipPath = Storage::disk('public')->path($bookFile);
        $zip = new \ZipArchive();

        if ($zip->open($zipPath) === true) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $name)) {
                    $tmpFile = tempnam(sys_get_temp_dir(), 'ocr');
                    file_put_contents($tmpFile, $zip->getFromIndex($i));
                    $ocrText .= ' ' . $this->runTesseract($tmpFile);
                    @unlink($tmpFile);
                }
            }
            $zip->close();
        }

        return trim($ocrText);
    }

    /**
     * Run Tesseract OCR on a file path
     */
    private function runTesseract($filePath)
    {
        try {
            return (new TesseractOCR($filePath))->run();
        } catch (\Throwable $e) {
            return '';
        }
    }

    /**
     * Resolve relative image path in HTML
     */
    private function resolveImagePath($imgSrc)
    {
        // Handle base64 images (skip)
        if (str_starts_with($imgSrc, 'data:')) {
            return null;
        }

        // Convert relative path to storage path
        $path = ltrim($imgSrc, '/');
        return $path;
    }

    /**
     * Save a page to DB
     */
    public function makeBookPage($bookId, $index, $content)
    {
        BookPages::create([
            'book_id' => $bookId,
            'page_number' => $index,
            'content' => $content,
        ]);
    }
}