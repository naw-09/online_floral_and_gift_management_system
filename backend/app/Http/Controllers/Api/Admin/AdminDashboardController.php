<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $ordersCount = Order::count();
        $productsCount = Product::count();
        $usersCount = User::where('role', 'user')->count();
        $totalSales = Order::whereIn('status', [Order::STATUS_PREPARED, Order::STATUS_DELIVERED])->sum('total');
        $recentOrders = Order::with('user')->latest()->take(10)->get();
        $ordersByStatus = Order::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
        return response()->json([
            'orders_count' => $ordersCount,
            'products_count' => $productsCount,
            'users_count' => $usersCount,
            'total_sales' => round($totalSales, 2),
            'recent_orders' => $recentOrders,
            'orders_by_status' => $ordersByStatus,
        ]);
    }
}
