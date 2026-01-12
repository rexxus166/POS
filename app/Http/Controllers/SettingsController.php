<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        // Tampilkan halaman form setting
        return Inertia::render('Settings/Index', [
            'tenant' => Auth::user()->tenant
        ]);
    }

    public function updateQris(Request $request)
    {
        $request->validate([
            'qris_image' => 'required|image|max:2048', // Validasi file gambar
            'qris_raw_string' => 'required|string',    // String hasil decode JS
        ]);

        $user = Auth::user();
        $tenant = $user->tenant;

        // 1. Upload File Gambar Fisik (buat arsip aja)
        if ($request->hasFile('qris_image')) {
            $path = $request->file('qris_image')->store('qris_uploads', 'public');
            $tenant->qris_static_image = $path;
        }

        // 2. Simpan String Mentah (INI YANG PENTING BUAT POS)
        $tenant->qris_raw_string = $request->qris_raw_string;

        $tenant->save();

        return redirect()->back()->with('success', 'QRIS Berhasil disimpan!');
    }
}
