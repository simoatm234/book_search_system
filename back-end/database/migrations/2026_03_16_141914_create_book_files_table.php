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
        Schema::create('book_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')
                ->constrained('books')
                ->onDelete('cascade');
            $table->string('file_path');  
            $table->string('cover_path');  
            
            $table->string('file_format', 10); 
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_files');
    }
};
