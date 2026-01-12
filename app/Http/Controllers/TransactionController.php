<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Tenant;
use App\Helpers\QrisLogic;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TransactionController extends Controller
{
    public function generateQris(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100', // Minimal Rp 100 perak
        ]);

        $user = Auth::user();
        $tenant = $user->tenant;

        if (!$tenant || !$tenant->qris_raw_string) {
            return response()->json(['error' => 'Toko ini belum upload QRIS Statis!'], 400);
        }

        // 1. Ambil String Mentah dari Database
        $rawQris = $tenant->qris_raw_string;

        // 2. Manipulasi jadi Dinamis pakai Helper kita
        $dynamicQrisString = QrisLogic::injectAmount($rawQris, $request->amount);

        // 3. Render jadi SVG (Ringan & Tajam)
        $qrImage = QrCode::size(300)->generate($dynamicQrisString);

        // Kirim balik SVG-nya ke React
        return response()->json([
            'qris_string' => $dynamicQrisString, // Buat debugging
            'qris_image' => (string) $qrImage
        ]);
    }
}
