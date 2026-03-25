<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    const TYPE_FLORAL = 'floral';
    const TYPE_GIFT = 'gift';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image',
        'type',
        'is_active',
        'stock',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
