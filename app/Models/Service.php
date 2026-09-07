<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'features',
        'icon',
        'gradient',
        'price',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}