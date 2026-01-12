<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Tenant;
use Zxing\QrReader; // Library Pembaca QR Code

class StoreController extends Controller
{
    public function update(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'qris_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'qris_raw_string' => 'nullable|string', // String hasil scan manual
        ]);

        $user = Auth::user();
        // Gunakan relasi tenant yang sudah ada di User Model
        $tenant = $user->tenant;

        if (!$tenant) {
            return redirect()->back()->withErrors(['msg' => 'Tenant tidak ditemukan untuk user ini.']);
        }

        // 2. Simpan Data Teks
        // Mapping: input 'name' -> database 'business_name'
        $tenant->business_name = $request->name;
        // Simpan address jika kolom tersedia (atau simpan di settings JSON jika tidak ada kolom address)
        // Kita coba simpan langsung, asumsi kolom ada atau pakai settings
        $tenant->forceFill(['address' => $request->address]);

        // Simpan QRIS Raw String (PENTING)
        if ($request->has('qris_raw_string')) {
            $tenant->qris_raw_string = $request->qris_raw_string;
        }

        // 3. Logic Upload Gambar QRIS
        if ($request->hasFile('qris_image')) {
            // Hapus gambar lama jika ada
            if ($tenant->qris_static_image) {
                Storage::disk('public')->delete($tenant->qris_static_image);
            }

            // Simpan gambar baru
            $path = $request->file('qris_image')->store('qris_images', 'public');
            $tenant->qris_static_image = $path;

            // --- AUTO READ QRIS STRING ---
            try {
                // Ambil full path file yang baru diupload
                $fullPath = storage_path('app/public/' . $path);

                // Baca QR Code
                $qrcode = new QrReader($fullPath);
                $text = $qrcode->text(); // Dapatkan string mentah

                if ($text) {
                    $tenant->qris_raw_string = $text;
                    // Flash message success scan
                    session()->flash('success_scan', 'QRIS berhasil dibaca otomatis!');
                } else {
                    session()->flash('error_scan', 'Gagal membaca QRIS otomatis. Mohon isi String Mentah secara manual.');
                }
            } catch (\Exception $e) {
                // Jangan error global, cukup notif aja kalau gagal baca
                session()->flash('error_scan', 'Gagal membaca QRIS: ' . $e->getMessage());
            }
        }

        $tenant->save();

        return redirect()->route('settings')->with('message', 'Data toko berhasil diupdate!');
    }
}
