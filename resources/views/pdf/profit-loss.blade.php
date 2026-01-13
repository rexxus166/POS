<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Laba Rugi</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #4F46E5; text-align: center; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { margin: 20px 0; }
        .summary-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
        .summary-item strong { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #4F46E5; color: white; }
        .total { font-weight: bold; background-color: #f3f4f6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 LAPORAN LABA RUGI</h1>
        <p><strong>{{ $tenant->business_name }}</strong></p>
        <p>Periode: {{ date('d/m/Y', strtotime($start_date)) }} - {{ date('d/m/Y', strtotime($end_date)) }}</p>
    </div>

    <div class="summary">
        <h3>Ringkasan Keuangan</h3>
        <div class="summary-item">
            <span>Total Pendapatan:</span>
            <strong>Rp {{ number_format($total_revenue, 0, ',', '.') }}</strong>
        </div>
        <div class="summary-item">
            <span>HPP (Harga Pokok Penjualan):</span>
            <strong>Rp {{ number_format($cogs, 0, ',', '.') }}</strong>
        </div>
        <div class="summary-item">
            <span>Laba Kotor:</span>
            <strong style="color: {{ $gross_profit >= 0 ? 'green' : 'red' }}">
                Rp {{ number_format($gross_profit, 0, ',', '.') }}
            </strong>
        </div>
        <div class="summary-item">
            <span>Margin Laba:</span>
            <strong>{{ $gross_profit_margin }}%</strong>
        </div>
    </div>

    <h3>Top 10 Produk Berdasarkan Profit</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Terjual</th>
                <th>Pendapatan</th>
                <th>HPP</th>
                <th>Profit</th>
            </tr>
        </thead>
        <tbody>
            @foreach($top_products as $index => $product)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ $product->total_sold }} pcs</td>
                <td>Rp {{ number_format($product->revenue, 0, ',', '.') }}</td>
                <td>Rp {{ number_format($product->cogs, 0, ',', '.') }}</td>
                <td>Rp {{ number_format($product->profit, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
        <p>Dicetak pada: {{ date('d/m/Y H:i:s') }}</p>
        <p>Powered by SobatNiaga POS</p>
    </div>
</body>
</html>
