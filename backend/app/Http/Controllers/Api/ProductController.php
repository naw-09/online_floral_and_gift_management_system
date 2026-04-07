<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of active products with images.
     */
    public function index(Request $request)
    {
        
        $query = Product::with('category')->where('is_active', true);

        // Filter by Category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by Type (floral/gift)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search by Name or Description
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Price Range Filtering
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $products = $query->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        // Security: Don't show inactive products to public users
        if (!$product->is_active) {
            return response()->json(['message' => 'Product is currently unavailable'], 404);
        }

        $product->load('category');

        return response()->json($product);
    }
}