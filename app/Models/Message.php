<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * Table Name
     */
    protected $table = 'messages';

    /**
     * Mass Assignment
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
    ];

    /**
     * Default Values
     */
    protected $attributes = [
        'status' => 'unread',
    ];

    /**
     * Casts
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}