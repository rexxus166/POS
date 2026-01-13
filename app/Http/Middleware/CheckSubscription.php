<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     * 
     * Middleware ini digunakan untuk membatasi akses fitur berdasarkan status subscription.
     * Usage di route: ->middleware('subscription:pro')
     */
    public function handle(Request $request, Closure $next, string $requiredLevel = 'pro'): Response
    {
        $user = Auth::user();

        // 1. Super Admin (Owner) bebas akses semua fitur
        if ($user->role === 'owner') {
            return $next($request);
        }

        // 2. Cek apakah user punya tenant
        if (!$user->tenant) {
            return redirect()->route('dashboard')->with('error', 'Toko tidak ditemukan.');
        }

        $tenant = $user->tenant;

        // 3. Cek level subscription yang dibutuhkan
        if ($requiredLevel === 'pro') {
            // Fitur ini hanya untuk Pro Business (status = 'active')
            if ($tenant->status !== 'active') {
                // Redirect dengan pesan error atau ke halaman upgrade
                return redirect()->back()->with('error', 'Fitur ini hanya tersedia untuk paket Pro Business. Upgrade sekarang!');
            }
        }

        // 4. Jika lolos semua pengecekan, lanjutkan request
        return $next($request);
    }
}
