<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gift_message' => ['nullable', 'string'],
            'delivery_date' => ['nullable', 'date', 'after_or_equal:today'],
            'delivery_address' => ['required', 'string'],
            'delivery_phone' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $total = $cartItems->sum(fn ($item) => $item->quantity * $item->product->price);
        $order = Order::create([
            'user_id' => $user->id,
            'status' => Order::STATUS_PENDING,
            'total' => $total,
            'gift_message' => $validated['gift_message'] ?? null,
            'delivery_date' => $validated['delivery_date'] ?? null,
            'delivery_address' => $validated['delivery_address'],
            'delivery_phone' => $validated['delivery_phone'] ?? $user->phone,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->product->price,
            ]);
        }
        $user->cartItems()->delete();

        $order->load('items.product');
        return response()->json($order, 201);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $order->load('items.product');
        return response()->json($order);
    }
}
