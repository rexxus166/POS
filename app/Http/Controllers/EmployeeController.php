<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class EmployeeController extends Controller
{
    // 1. Tampilkan Daftar Karyawan
    public function index()
    {
        $user = Auth::user();

        // [BARU] CEK STATUS BERLANGGANAN (FITUR PRO)
        if ($user->tenant->status !== 'active') {
            // Jika status masih trial, tidak boleh akses
            return redirect()->back()->with('error', 'Fitur Manajemen Karyawan hanya untuk paket PRO.');
            // Atau bisa return Inertia Page khusus "Upgrade Pro"
        }

        // Ambil user lain yang satu toko, TAPI kecualikan diri sendiri
        $employees = User::where('tenant_id', $user->tenant_id)
            ->where('id', '!=', $user->id) // Jangan tampilkan akun sendiri
            ->latest()
            ->get();

        return Inertia::render('Employees/Index', [
            'employees' => $employees
        ]);
    }

    // 2. Simpan Akun Kasir Baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $currentUser = Auth::user();

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tenant_id' => $currentUser->tenant_id, // Masukkan ke toko yang sama
            'role' => 'cashier', // <--- KUNCI PENTING: Set role otomatis jadi cashier
        ]);

        return redirect()->back()->with('success', 'Akun kasir berhasil dibuat!');
    }

    // 3. Hapus Karyawan (Pecat)
    public function destroy($id)
    {
        $currentUser = Auth::user();

        // Pastikan yang dihapus adalah bawahan di toko yang sama
        $employee = User::where('tenant_id', $currentUser->tenant_id)
            ->where('id', '!=', $currentUser->id)
            ->findOrFail($id);

        $employee->delete();

        return redirect()->back()->with('success', 'Data karyawan dihapus.');
    }
}
