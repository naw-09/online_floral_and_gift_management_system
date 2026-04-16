<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Price filters
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // POPULAR FILTER 
        if ($request->filled('is_popular') && $request->is_popular == '1') {
            $query->where('is_popular', 1);
        }

        //  DISCOUNT FILTER 
        if ($request->filled('has_discount') && $request->has_discount == '1') {
            $query->where(function ($q) {
                $q->whereNotNull('discount_price')
                  ->where('discount_price', '>', 0);
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $products = $query->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    public function show(Product $product)
    {
        if (!$product->is_active) {
            return response()->json(['message' => 'Product is currently unavailable'], 404);
        }

        $product->load('category');

        return response()->json($product);
    }

    // Popular products API
    public function popular()
    {
        return Product::with('category')
            ->where('is_active', true)
            ->where('is_popular', true)
            ->latest()
            ->take(6)
            ->get();
    }

    // Discount products API
    public function discounted()
    {
        return Product::with('category')
            ->where('is_active', true)
            ->where('discount_price', '>', 0)
            ->latest()
            ->take(6)
            ->get();
    }
}