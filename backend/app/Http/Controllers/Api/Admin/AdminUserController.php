<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    // public function index(Request $request)
    // {
    //     $query = User::where('role', 'user');
    //     if ($request->filled('search')) {
    //         $query->where(function ($q) use ($request) {
    //             $q->where('name', 'like', '%' . $request->search . '%')
    //               ->orWhere('email', 'like', '%' . $request->search . '%');
    //         });
    //     }
    //     $users = $query->latest()->paginate($request->get('per_page', 15));
    //     return response()->json($users);
    // }

    public function index(Request $request)
{
    try {
        $query = User::where('role', 'user');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($users);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
        ], 500);
    }
}

    public function show(User $user)
    {
       $user->loadCount('orders');
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        if ($user->role === User::ROLE_ADMIN) {
            return response()->json(['message' => 'Cannot modify admin user'], 403);
        }
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);
        $user->update($validated);
        return response()->json($user->fresh());
    }
}
