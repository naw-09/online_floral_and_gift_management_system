<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user');
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        $orders = $query->latest()->paginate($request->get('per_page', 15));
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);
        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,prepared,delivered,cancelled'],
        ]);
        $order->update(['status' => $validated['status']]);
        $order->load(['user', 'items.product']);
        return response()->json($order);
    }
}
