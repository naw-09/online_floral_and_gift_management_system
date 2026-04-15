<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get logged-in user orders
     */
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Place order (CHECKOUT)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'gift_message' => ['nullable', 'string'],
            'delivery_date' => ['nullable', 'date', 'after_or_equal:today'],
            'delivery_address' => ['required', 'string'],
            'delivery_phone' => ['required', 'string'],
        ]);

        $user = $request->user();

        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 422);
        }

        return DB::transaction(function () use ($user, $cartItems, $validated) {

            $total = 0;

            $order = Order::create([
                'user_id' => $user->id,
                'status' => Order::STATUS_PENDING,
                'total' => 0,
                'gift_message' => $validated['gift_message'] ?? null,
                'delivery_date' => $validated['delivery_date'] ?? null,
                'delivery_address' => $validated['delivery_address'],
                'delivery_phone' => $validated['delivery_phone'],
            ]);

            foreach ($cartItems as $item) {

                $product = Product::lockForUpdate()->findOrFail($item->product_id);

                if ($product->stock < $item->quantity) {
                    return response()->json([
                        'message' => "Not enough stock for {$product->name}"
                    ], 422);
                }

                
                $product->decrement('stock', $item->quantity);

                $lineTotal = $product->price * $item->quantity;
                $total += $lineTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $product->price,
                ]);
            }

            $order->update(['total' => $total]);

            $user->cartItems()->delete();

            return response()->json(
                $order->load('items.product'),
                201
            );
        });
    }

    /**
     * Show single order (user only)
     */
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            $order->load('items.product')
        );
    }
}