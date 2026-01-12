<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckStoreStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // 1. Kalau Super Admin (Owner), loloskan saja (biar bisa pantau)
        if ($user->role === 'owner') {
            return $next($request);
        }

        // 2. Cek apakah user punya toko
        if ($user->tenant) {

            // 3. Cek Status: SUSPENDED
            if ($user->tenant->status === 'suspended') {
                // Jangan pakai Inertia::render langsung di sini karena bisa loop
                // Lebih baik redirect ke route khusus error
                return redirect()->route('store.suspended');
            }

            // 4. Cek Status: EXPIRED (Trial / Active tapi masa aktif habis)
            if ($user->tenant->subscription_ends_at && now()->greaterThan($user->tenant->subscription_ends_at)) {
                return redirect()->route('store.expired');
            }
        }

        return $next($request);
    }
}
