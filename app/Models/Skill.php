<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    /**
     * Skills table
     */
    protected $table = 'skills';

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'name',
        'category',
        'level',
        'icon',
        'description',
        'status',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'level' => 'integer',
    ];
}