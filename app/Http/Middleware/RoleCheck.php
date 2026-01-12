<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();

        // Cek apakah role user ada di dalam daftar role yang diizinkan
        // Contoh penggunaan di route: middleware('role:owner,admin')
        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        // Kalau dilarang, lempar ke dashboard masing-masing atau 403
        if ($user->role === 'cashier') {
            return redirect('/pos'); // Halaman kasir
        }

        return abort(403, 'Anda tidak memiliki akses ke halaman ini.');
    }
}
