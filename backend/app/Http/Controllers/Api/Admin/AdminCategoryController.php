<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::withCount('products')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'], 
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        $category->load('products');
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'], 
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        //  new image
        if ($request->hasFile('image')) {

            // delete old image
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return response()->json($category->fresh());
    }

    public function destroy(Category $category)
        {
        // delete image when category deleted
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}