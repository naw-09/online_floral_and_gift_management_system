<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()->cartItems()->with('product')->get();
        $total = $items->sum(fn ($item) => $item->quantity * $item->product->price);
        return response()->json([
            'items' => $items,
            'total' => round($total, 2),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        if (!$product->is_active) {
            return response()->json(['message' => 'Product not available'], 422);
        }

        $item = CartItem::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $validated['product_id'],
            ],
            ['quantity' => $validated['quantity']]
        );
        $item->load('product');
        return response()->json($item, 201);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate(['quantity' => ['required', 'integer', 'min:1']]);
        $cartItem->update($validated);
        $cartItem->load('product');
        return response()->json($cartItem);
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $cartItem->delete();
        return response()->json(null, 204);
    }
}
