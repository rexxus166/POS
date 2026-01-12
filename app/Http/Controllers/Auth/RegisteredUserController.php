<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Store; // Pastikan import Model Tenant/Store
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Import DB Transaction
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi Input
        $request->validate([
            'business_name' => 'required|string|max:255', // Validasi Nama Toko
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Gunakan Transaction biar Data Konsisten
        // (Kalau User kebuat tapi Toko gagal, semuanya dibatalkan)
        DB::transaction(function () use ($request) {

            // A. Buat User Baru (Role: Admin Toko)
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin', // <--- PENTING: Set role jadi admin toko
                // tenant_id masih kosong, nanti diupdate setelah toko jadi
            ]);

            // B. Buat Toko Baru
            $store = Store::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'slug' => \Illuminate\Support\Str::slug($request->business_name) . '-' . \Illuminate\Support\Str::random(4), // Add slug generation
                'status' => 'trial', // Default status Trial
                'address' => '-', // Default kosong dulu
            ]);

            // C. Update User agar punya tenant_id
            $user->update([
                'tenant_id' => $store->id
            ]);

            // D. Login Otomatis
            Auth::login($user);

            event(new Registered($user));
        });

        // 3. Redirect ke Dashboard
        return redirect(route('dashboard', absolute: false));
    }
}
