<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('title', 500);
            $table->text('summaries')->nullable();
            $table->json('authors')->nullable();
            $table->json('translators')->nullable();
            $table->json('bookshelves')->nullable();
            $table->json('subjects')->nullable();
            $table->json('languages')->nullable();
            $table->string('media_type')->nullable();

            // Identifiers
            $table->integer('gutendex_id')->unique(); // unique ID from Gutendex
            $table->integer('download_count')->default(0);

            // Formats (ebook links)
            $table->json('formats')->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index('title');
            $table->index('download_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
