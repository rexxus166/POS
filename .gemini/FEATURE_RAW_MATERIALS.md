# 🧪 Fitur Manajemen Bahan Mentah (Raw Materials Management)

## 📋 Overview
Fitur ini memungkinkan admin toko untuk:
1. Mengelola stok bahan mentah dengan satuan flexible
2. Membuat resep/recipe untuk setiap produk
3. Otomatis mengurangi stok bahan mentah saat transaksi
4. Monitoring stok bahan mentah real-time
5. Alert jika stok menipis

---

## 🏗️ Database Schema

### 1. Tabel `raw_materials` (Bahan Mentah)
```sql
- id
- tenant_id (FK)
- name (varchar) → Nama bahan (e.g., "Kopi Arabica", "Susu UHT", "Gula Pasir")
- sku (varchar, nullable) → Kode bahan
- stock (decimal 10,2) → Stok saat ini
- unit (varchar) → Satuan (ml, kg, liter, gram, pcs, dll)
- cost_per_unit (decimal 15,2) → Harga per satuan
- min_stock (decimal 10,2, default 0) → Minimum stok (untuk alert)
- category (varchar, default 'General') → Kategori bahan
- supplier (varchar, nullable) → Nama supplier
- notes (text, nullable) → Catatan
- timestamps
```

### 2. Tabel `product_recipes` (Resep Produk)
```sql
- id
- product_id (FK) → Produk yang menggunakan bahan ini
- raw_material_id (FK) → Bahan mentah yang digunakan
- quantity (decimal 10,2) → Jumlah bahan yang dibutuhkan per unit produk
- timestamps

UNIQUE KEY (product_id, raw_material_id) → Satu produk tidak bisa punya bahan yang sama 2x
```

### 3. Tabel `raw_material_transactions` (History Stok Bahan)
```sql
- id
- tenant_id (FK)
- raw_material_id (FK)
- transaction_type (enum: 'purchase', 'usage', 'adjustment', 'waste')
- quantity (decimal 10,2) → Jumlah (+/-)
- stock_before (decimal 10,2) → Stok sebelum
- stock_after (decimal 10,2) → Stok sesudah
- reference_id (bigint, nullable) → ID transaksi penjualan (jika type=usage)
- notes (text, nullable)
- user_id (FK) → Yang melakukan transaksi
- timestamps
```

---

## 🔄 Business Logic Flow

### Flow 1: Tambah Bahan Mentah
```
1. Admin buka halaman "Bahan Mentah"
2. Klik "Tambah Bahan"
3. Isi form:
   - Nama bahan
   - SKU (opsional)
   - Stok awal
   - Satuan (dropdown: ml, kg, liter, gram, pcs, custom)
   - Harga per satuan
   - Min stok (untuk alert)
   - Kategori
   - Supplier
4. Simpan → Insert ke `raw_materials`
```

### Flow 2: Set Resep Produk
```
1. Admin buka halaman "Produk"
2. Klik "Edit Resep" pada produk
3. Modal muncul dengan list bahan mentah
4. Pilih bahan + input jumlah yang dibutuhkan
5. Contoh: "Es Kopi Susu"
   - Kopi Arabica: 20 gram
   - Susu UHT: 200 ml
   - Gula Aren: 30 gram
   - Es Batu: 100 gram
6. Simpan → Insert/Update ke `product_recipes`
```

### Flow 3: Transaksi Penjualan (Auto Deduct)
```
1. Kasir proses transaksi di POS
2. Customer beli "Es Kopi Susu" x2
3. Backend (TransactionController):
   a. Simpan transaksi
   b. Loop setiap item di cart
   c. Cek apakah produk punya resep (product_recipes)
   d. Jika ada resep:
      - Loop setiap bahan di resep
      - Hitung total kebutuhan: quantity_resep × qty_produk
      - Kurangi stok bahan mentah
      - Catat di `raw_material_transactions` (type=usage)
   e. Jika stok bahan tidak cukup → Warning/Error
4. Transaksi selesai
```

### Flow 4: Restock Bahan Mentah
```
1. Admin buka halaman "Bahan Mentah"
2. Klik "Restock" pada bahan tertentu
3. Input jumlah tambahan
4. Backend:
   - Update stock di `raw_materials`
   - Catat di `raw_material_transactions` (type=purchase)
5. Stok bertambah
```

---

## 🎨 UI/UX Design

### Halaman: Manajemen Bahan Mentah
**Route:** `/raw-materials`

**Layout:**
- Header: "Manajemen Bahan Mentah"
- Button: "+ Tambah Bahan"
- Search bar
- Filter: Kategori, Stok Menipis
- Table:
  | Nama | SKU | Stok | Satuan | Harga/Unit | Min Stok | Status | Aksi |
  |------|-----|------|--------|------------|----------|--------|------|
  | Kopi Arabica | KB-001 | 5.5 kg | kg | Rp 150.000 | 2 kg | 🟢 Aman | Edit, Restock, Hapus |
  | Susu UHT | SU-001 | 1.2 liter | liter | Rp 15.000 | 5 liter | 🔴 Menipis | ... |

**Status Indicator:**
- 🟢 Aman: stock > min_stock
- 🟡 Perhatian: stock <= min_stock × 1.5
- 🔴 Menipis: stock <= min_stock

### Modal: Tambah/Edit Bahan
```
[Nama Bahan]     [________________]
[SKU (Opsional)] [________________]
[Stok Awal]      [________________]
[Satuan]         [Dropdown: ml, kg, liter, gram, pcs, unit, custom ▼]
[Harga/Unit]     [Rp _____________]
[Min Stok]       [________________]
[Kategori]       [________________]
[Supplier]       [________________]
[Catatan]        [________________]

[Batal]  [Simpan]
```

### Modal: Set Resep Produk (di halaman Produk)
```
Resep untuk: Es Kopi Susu

[+ Tambah Bahan]

| Bahan Mentah | Jumlah | Satuan | Aksi |
|--------------|--------|--------|------|
| Kopi Arabica | 20 | gram | Hapus |
| Susu UHT | 200 | ml | Hapus |
| Gula Aren | 30 | gram | Hapus |

[Tutup]  [Simpan Resep]
```

### Modal: Restock Bahan
```
Restock: Kopi Arabica
Stok Saat Ini: 5.5 kg

[Jumlah Tambahan] [________________] kg
[Catatan]         [________________]

[Batal]  [Restock]
```

---

## 📁 File Structure

### Backend
```
app/Models/
├── RawMaterial.php
├── ProductRecipe.php
└── RawMaterialTransaction.php

app/Http/Controllers/
└── RawMaterialController.php

database/migrations/
├── 2026_01_19_create_raw_materials_table.php
├── 2026_01_19_create_product_recipes_table.php
└── 2026_01_19_create_raw_material_transactions_table.php

routes/web.php
└── Add raw materials routes
```

### Frontend
```
resources/js/Pages/
└── RawMaterials/
    └── Index.jsx

resources/js/Components/
├── RawMaterialModal.jsx
├── RecipeModal.jsx
└── RestockModal.jsx
```

---

## ✅ Implementation Checklist

### Phase 1: Database & Models
- [ ] Create migration: `raw_materials`
- [ ] Create migration: `product_recipes`
- [ ] Create migration: `raw_material_transactions`
- [ ] Create model: `RawMaterial`
- [ ] Create model: `ProductRecipe`
- [ ] Create model: `RawMaterialTransaction`
- [ ] Add relationships to models

### Phase 2: Backend Logic
- [ ] Create `RawMaterialController`
  - [ ] index() → List bahan mentah
  - [ ] store() → Tambah bahan
  - [ ] update() → Edit bahan
  - [ ] destroy() → Hapus bahan
  - [ ] restock() → Tambah stok
  - [ ] getLowStock() → Bahan yang menipis
- [ ] Update `ProductController`
  - [ ] setRecipe() → Set resep produk
  - [ ] getRecipe() → Get resep produk
- [ ] Update `TransactionController`
  - [ ] Auto deduct raw materials on transaction

### Phase 3: Frontend
- [ ] Create page: `RawMaterials/Index.jsx`
- [ ] Create component: `RawMaterialModal.jsx`
- [ ] Create component: `RecipeModal.jsx`
- [ ] Create component: `RestockModal.jsx`
- [ ] Add "Kelola Resep" button di halaman Products
- [ ] Add alert untuk stok menipis di Dashboard

### Phase 4: Routes & Middleware
- [ ] Add routes untuk raw materials
- [ ] Apply middleware: `role:admin`
- [ ] Update navigation menu

### Phase 5: Testing
- [ ] Test CRUD bahan mentah
- [ ] Test set resep produk
- [ ] Test auto deduct saat transaksi
- [ ] Test restock
- [ ] Test alert stok menipis

### Phase 6: Seeder & Documentation
- [ ] Update DatabaseSeeder dengan data demo
- [ ] Update dokumentasi

---

## 🎯 Expected Results

### Dashboard Admin (Enhancement)
```
[Card: Stok Bahan Menipis]
⚠️ 3 Bahan Memerlukan Restock
- Susu UHT: 1.2 / 5 liter
- Gula Pasir: 0.5 / 2 kg
- Es Batu: 3 / 10 kg
[Lihat Semua →]
```

### Halaman Bahan Mentah
- List semua bahan dengan status stok
- Filter & search
- CRUD operations
- Restock function
- Export Excel (bonus)

### Halaman Produk (Enhanced)
- Button "Kelola Resep" di setiap produk
- Modal untuk set komposisi bahan
- Indikator produk yang sudah/belum punya resep

### Transaksi (Auto Deduct)
- Saat transaksi, stok bahan otomatis berkurang
- History tercatat di `raw_material_transactions`
- Warning jika stok tidak cukup

---

## 🚀 Future Enhancements
- [ ] Batch import bahan mentah via Excel
- [ ] Prediksi kebutuhan bahan berdasarkan penjualan
- [ ] Purchase order untuk supplier
- [ ] Barcode scanner untuk bahan mentah
- [ ] Cost analysis per produk (COGS)
- [ ] Waste tracking (bahan terbuang)
- [ ] Expiry date management

---

**Status:** Ready to Implement  
**Estimated Time:** 2-3 hours  
**Priority:** High
