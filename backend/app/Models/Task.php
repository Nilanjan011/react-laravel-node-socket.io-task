<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Task extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description','due_date','status'];

    protected function dueDate(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => date('m/d/Y', strtotime($value)),
        );
    }
}
