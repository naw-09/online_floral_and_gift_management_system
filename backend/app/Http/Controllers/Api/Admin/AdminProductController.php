<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    /**
     * List all products with their categories.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'type'        => ['required', 'in:floral,gift'],
            'is_active'   => ['nullable'],
            'is_popular'  => ['nullable'],
            'stock'       => ['nullable', 'integer', 'min:0'],
        ]);

        // slug
        $validated['slug'] = Str::slug($request->name);

        // booleans
        $validated['is_active'] = filter_var($request->is_active ?? true, FILTER_VALIDATE_BOOLEAN);
        $validated['is_popular'] = filter_var($request->is_popular ?? false, FILTER_VALIDATE_BOOLEAN);

        $validated['stock'] = $request->stock ?? 0;

        // image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);

        return response()->json($product->load('category'), 201);
    }

    /**
     * Show single product.
     */
    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    /**
     * Update product.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['sometimes', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'type'        => ['sometimes', 'in:floral,gift'],
            'is_active'   => ['nullable'],
            'is_popular'  => ['nullable'],
            'stock'       => ['nullable', 'integer', 'min:0'],
        ]);

        // slug update
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // booleans
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('is_popular')) {
            $validated['is_popular'] = filter_var($request->is_popular, FILTER_VALIDATE_BOOLEAN);
        }

        // image update
        if ($request->hasFile('image')) {

            if ($product->getRawOriginal('image')) {
                Storage::disk('public')->delete($product->getRawOriginal('image'));
            }

            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json($product->fresh()->load('category'));
    }

    /**
     * Delete product.
     */
    public function destroy(Product $product)
    {
        if ($product->getRawOriginal('image')) {
            Storage::disk('public')->delete($product->getRawOriginal('image'));
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}