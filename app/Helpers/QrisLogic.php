<?php

namespace App\Helpers;

class QrisLogic
{
    /**
     * Mengubah String QRIS Statis menjadi Dinamis dengan Nominal
     */
    public static function injectAmount($rawString, $amount)
    {
        // 1. Bersihkan string (Hapus CRC lama + Header 6304)
        // Format QRIS wajib diakhiri dengan Tag 63 (4 digit '6304' + 4 digit Hex CRC)
        // Total 8 karakter terakhir harus dibuang agar kita bisa inject data baru.
        $qris = $rawString;

        // Cek apakah ada '6304' di 8 karakter terakhir (posisi mulai -8, panjang 4)
        if (substr($rawString, -8, 4) === '6304') {
            $qris = substr($rawString, 0, -8);
        } else {
            // Fallback: Jika pattern tidak standar, coba cari tag 6304 terakhir manual
            $pos = strrpos($rawString, '6304');
            if ($pos !== false && $pos > strlen($rawString) - 10) {
                // Pastikan itu benar-benar di ujung (bukan di tengah data lain)
                $qris = substr($rawString, 0, $pos);
            }
        }

        // 2. Ubah Tag 01 (Point of Initiation) dari 11 (Static) jadi 12 (Dynamic)
        if (substr($qris, 0, 12) == '000201010211') {
            $qris = '000201010212' . substr($qris, 12);
        }

        // 3. Tambahkan Tag 54 (Transaction Amount)
        // Format: 54 + PanjangDigit + Nominal
        $amountStr = (string)$amount;
        $length = strlen($amountStr);
        if ($length < 10) {
            $length = '0' . $length;
        }

        // Append Tag 54
        $qris .= '54' . $length . $amountStr;

        // 4. Tambahkan Tag 58 (Country Code) jika belum ada. (Normally already in $qris)

        // 5. Tambahkan Tag 63 (CRC Start)
        $qris .= '6304';

        // 6. Hitung CRC16-CCITT
        $crc = self::crc16($qris);

        // 7. Gabungkan: String Bersih + Tag 54 + Tag 63 + CRC Baru
        return $qris . $crc;
    }

    /**
     * Algoritma CRC16 (CCITT-FALSE) standar EMVCo
     */
    public static function crc16($str)
    {
        $crc = 0xFFFF;
        for ($c = 0; $c < strlen($str); $c++) {
            $crc ^= ord($str[$c]) << 8;
            for ($i = 0; $i < 8; $i++) {
                if ($crc & 0x8000) {
                    $crc = ($crc << 1) ^ 0x1021;
                } else {
                    $crc = $crc << 1;
                }
            }
        }
        $hex = dechex($crc & 0xFFFF);
        return strtoupper(sprintf("%04s", $hex));
    }
}
