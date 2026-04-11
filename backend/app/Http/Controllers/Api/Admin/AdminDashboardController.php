<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get statistics and recent activity for the Admin Dashboard.
     */
    public function index(Request $request)
    {
        // 1. Get specific status counts and general stats
        $stats = [
            'total_orders'     => Order::count(),
            'today_orders'     => Order::whereDate('created_at', Carbon::today())->count(),
            'pending_orders'   => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_products'   => Product::count(),
            'total_users'      => User::where('role', 'user')->count(),
            'total_sales'      => round(Order::whereIn('status', ['prepared', 'delivered'])->sum('total'), 2),
        ];

        // 2. Get recent orders with user information
        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->take(10)
            ->get();

        $chartData = Order::select([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total_sales')
            ])
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->whereIn('status', ['prepared', 'delivered'])
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent_orders' => $recentOrders,
            'chart_data' => $chartData,
        ]);
    }
}