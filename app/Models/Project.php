<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'technologies',
        'status',
        'icon',
        'gradient',
        'live_url',
        'github_url',
    ];

    protected $casts = [
        'technologies' => 'array',
    ];
}