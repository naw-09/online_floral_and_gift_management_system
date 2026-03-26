<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

public function update(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => ['sometimes', 'string', 'max:255'],
        'phone' => ['nullable', 'string', 'max:20'],
        'address' => ['nullable', 'string'],
        'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'], 
    ]);

    if ($request->hasFile('avatar')) {
        // Optional: Delete the old image if it exists
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        // Store the new image in 'storage/app/public/avatars'
        $path = $request->file('avatar')->store('avatars', 'public');
        $validated['avatar_path'] = $path;
    }

    $user->update($validated);

    return response()->json($user->fresh());
}