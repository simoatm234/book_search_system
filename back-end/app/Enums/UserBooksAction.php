<?php

namespace App\Enums;

enum UserBooksAction: string
{
    case READ = 'read';
    case DOWNLOADED = 'downloaded';

    /**
     * Get all values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get label for display
     */
    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read',
            self::DOWNLOADED => 'Downloaded',
        };
    }

    /**
     * Get icon class
     */
    public function icon(): string
    {
        return match ($this) {
            self::READ => 'eye',
            self::DOWNLOADED => 'download',
        };
    }

    /**
     * Get color for badge
     */
    public function color(): string
    {
        return match ($this) {
            self::READ => 'blue',
            self::DOWNLOADED => 'green',
        };
    }
}
