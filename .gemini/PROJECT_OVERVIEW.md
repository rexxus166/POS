# 📊 POS SaaS - Project Overview & Documentation

> **Dokumentasi Lengkap Project POS SaaS Multi-Tenant**  
> Dibuat: 19 Januari 2026  
> Tech Stack: Laravel 12 + React (Inertia.js) + TailwindCSS

---

## 🎯 Konsep Utama

**POS SaaS** adalah aplikasi Point of Sale berbasis web yang menggunakan arsitektur **Multi-Tenant**. Artinya:
- **Satu aplikasi** melayani **banyak toko/bisnis** (tenant)
- Setiap tenant memiliki **data terpisah** (produk, transaksi, karyawan)
- Ada **Super Admin (Owner)** yang mengelola semua tenant
- Sistem **subscription-based** dengan paket Trial dan Pro Business

---

## 🏗️ Arsitektur Database

### **Tabel Utama**

#### 1. **users** - Pengguna Sistem
```
- id
- tenant_id (FK) → Toko tempat user bekerja
- name
- email
- password
- role: 'owner' | 'admin' | 'cashier'
```

**Role Hierarchy:**
- `owner` → Super Admin (Owner Aplikasi SaaS) - tidak terikat tenant
- `admin` → Pemilik Toko (1 tenant = 1 admin)
- `cashier` → Kasir (bisa banyak per tenant)

#### 2. **tenants** - Data Toko/Bisnis
```
- id
- user_id (FK) → Admin/pemilik toko
- business_name
- slug (unique)
- address
- qris_static_image
- qris_raw_string → String QRIS untuk manipulasi dinamis
- settings (JSON) → Kustomisasi per toko
  {
    "tax_rate": 11,
    "service_charge": 5,
    "print_logo": true,
    "footer_struk": "Terima kasih!",
    "wifi_pass": "..."
  }
- subscription_ends_at (date)
- status: 'active' | 'trial' | 'suspended' | 'inactive'
```

**Status Subscription:**
- `trial` → Uji coba gratis (fitur terbatas)
- `active` → Pro Business (full features)
- `suspended` → Ditangguhkan oleh admin
- `inactive` → Tidak aktif

#### 3. **products** - Produk/Jasa
```
- id
- tenant_id (FK)
- name
- sku (barcode/kode produk)
- price (decimal)
- cost_price (HPP/modal)
- stock (integer)
- is_stock_managed (boolean) → false untuk jasa
- category
- attributes (JSON) → Kustomisasi produk
  {
    "type": "beverage",
    "sugar": ["Less", "Normal", "Extra"],
    "ice": ["Less", "Normal"],
    "topping": ["Jelly", "Boba"]
  }
- image
```

#### 4. **transactions** - Header Transaksi
```
- id
- tenant_id (FK)
- user_id (FK) → Kasir yang melayani
- invoice_code (unique) → INV-timestamp-random
- total_amount
- cash_amount
- change_amount
- payment_method: 'cash' | 'qris'
- status: 'paid' | 'pending' | 'cancelled'
```

#### 5. **transaction_details** - Detail Item Belanja
```
- id
- transaction_id (FK)
- product_id (FK)
- quantity
- price (harga saat transaksi)
- subtotal
```

#### 6. **activity_logs** - Log Aktivitas (Pro Only)
```
- id
- tenant_id (FK)
- user_id (FK)
- action_type: 'transaction' | 'product_update' | 'employee_action'
- description
- metadata (JSON)
```

---

## 🔐 Sistem Role & Permission

### **Middleware yang Digunakan:**

1. **`RoleCheck`** (`role:owner,admin,cashier`)
   - Membatasi akses berdasarkan role user
   - Contoh: `middleware('role:admin')` → hanya admin yang bisa akses

2. **`CheckStoreStatus`** (`store-status`)
   - Cek apakah toko aktif/suspended/expired
   - Redirect ke halaman error jika tidak aktif

3. **`CheckSubscription`** (`subscription:pro`)
   - Membatasi fitur berdasarkan paket subscription
   - Contoh: Laporan keuangan hanya untuk Pro Business

### **Akses Fitur Berdasarkan Role:**

| Fitur | Owner | Admin | Cashier |
|-------|-------|-------|---------|
| Dashboard Super Admin | ✅ | ❌ | ❌ |
| Kelola Semua Tenant | ✅ | ❌ | ❌ |
| Dashboard Toko | ❌ | ✅ | ❌ |
| Manajemen Produk | ❌ | ✅ | ❌ |
| Manajemen Karyawan | ❌ | ✅ (Pro) | ❌ |
| POS System | ❌ | ✅ | ✅ |
| Riwayat Transaksi | ❌ | ✅ | ✅ |
| Laporan Keuangan | ❌ | ✅ (Pro) | ❌ |
| Activity Logs | ❌ | ✅ (Pro) | ❌ |
| Settings Toko | ❌ | ✅ | ❌ |

---

## 🚀 Fitur Utama

### **1. Multi-Tenant Architecture**
- Setiap tenant memiliki data terpisah
- Isolasi data menggunakan `tenant_id` di setiap query
- Satu database untuk semua tenant (shared database)

### **2. QRIS Dinamis**
- Upload QRIS statis dari payment gateway
- Decode string QRIS
- Inject nominal transaksi secara real-time
- Generate QR Code baru untuk setiap transaksi

**Helper:** `app/Helpers/QrisLogic.php`
```php
QrisLogic::injectAmount($rawQris, $amount)
```

### **3. Subscription System**
**Trial (Gratis):**
- Akses POS System
- Lihat omzet hari ini
- Riwayat transaksi
- Durasi: 14 hari

**Pro Business:**
- Semua fitur Trial +
- Manajemen karyawan
- Laporan keuangan (Profit/Loss, Financial Report)
- Export Excel & PDF
- Activity logs
- Unlimited duration (selama bayar)

### **4. Customisasi Per Tenant**
Setiap toko bisa setting:
- Logo struk
- Footer struk
- Tax rate (PPN)
- Service charge
- WiFi password
- Dan lainnya (JSON flexible)

### **5. Produk dengan Atribut Dinamis**
Contoh:
- **Minuman:** Sugar level, Ice level, Topping
- **Makanan:** Spicy level, Extra request
- **Jasa:** Durasi, Pilihan stylist

### **6. Activity Logging (Pro Only)**
Mencatat:
- Transaksi yang dilakukan
- Update produk
- Aksi karyawan
- Metadata lengkap dalam JSON

---

## 📁 Struktur Project

### **Backend (Laravel)**

```
app/
├── Console/
├── Exports/              # Export Excel (Maatwebsite)
│   ├── ProfitLossExport.php
│   └── FinancialExport.php
├── Helpers/              # Helper Functions
│   ├── QrisLogic.php     # Manipulasi QRIS
│   └── ActivityLogger.php # Log aktivitas
├── Http/
│   ├── Controllers/
│   │   ├── Auth/         # Breeze Auth Controllers
│   │   ├── DashboardController.php
│   │   ├── PosController.php
│   │   ├── ProductController.php
│   │   ├── TransactionController.php
│   │   ├── EmployeeController.php
│   │   ├── ReportController.php
│   │   ├── ActivityLogController.php
│   │   ├── SettingsController.php
│   │   ├── StoreController.php
│   │   └── SuperAdminController.php
│   ├── Middleware/
│   │   ├── RoleCheck.php
│   │   ├── CheckStoreStatus.php
│   │   ├── CheckSubscription.php
│   │   └── HandleInertiaRequests.php
│   └── Requests/
├── Models/
│   ├── User.php
│   ├── Tenant.php
│   ├── Product.php
│   ├── Transaction.php
│   ├── TransactionDetail.php
│   ├── ActivityLog.php
│   └── Store.php
├── Notifications/
└── Providers/

database/
├── migrations/
│   ├── create_users_table.php
│   ├── create_tenants_table.php
│   ├── create_products_table.php
│   ├── create_transactions_table.php
│   ├── create_transaction_details_table.php
│   └── create_activity_logs_table.php
└── seeders/
    └── DatabaseSeeder.php  # Seed data demo

routes/
├── web.php               # Main routes
├── auth.php              # Breeze auth routes
├── api.php
└── console.php
```

### **Frontend (React + Inertia)**

```
resources/js/
├── Components/           # Reusable components
│   ├── ApplicationLogo.jsx
│   ├── Checkbox.jsx
│   ├── DangerButton.jsx
│   ├── Dropdown.jsx
│   ├── InputError.jsx
│   ├── InputLabel.jsx
│   ├── Modal.jsx
│   ├── NavLink.jsx
│   ├── PrimaryButton.jsx
│   ├── SecondaryButton.jsx
│   ├── TextInput.jsx
│   └── ...
├── Layouts/
│   ├── AuthenticatedLayout.jsx
│   └── GuestLayout.jsx
├── Pages/
│   ├── Auth/             # Login, Register, etc
│   ├── Dashboard.jsx     # Dashboard tenant
│   ├── POS/
│   │   └── Index.jsx     # Halaman kasir
│   ├── Products/
│   │   └── Index.jsx     # Manajemen produk
│   ├── Employees/
│   │   └── Index.jsx     # Manajemen karyawan
│   ├── Transaction/
│   │   ├── History.jsx   # Riwayat transaksi
│   │   └── Receipt.jsx   # Struk belanja
│   ├── Reports/
│   │   ├── ProfitLoss.jsx
│   │   └── Financial.jsx
│   ├── ActivityLogs/
│   │   └── Index.jsx
│   ├── Settings/
│   │   └── Index.jsx
│   ├── SuperAdmin/
│   │   ├── Dashboard.jsx
│   │   └── Tenants.jsx
│   ├── Errors/
│   │   ├── Suspended.jsx
│   │   └── Expired.jsx
│   └── Welcome.jsx       # Landing page
├── app.jsx
└── bootstrap.js
```

---

## 🛣️ Routing Structure

### **Public Routes**
```
GET  /                    → Welcome page (landing)
```

### **Auth Routes** (Breeze)
```
GET  /login               → Login page
POST /login               → Login action
GET  /register            → Register page
POST /register            → Register action
POST /logout              → Logout
GET  /forgot-password     → Forgot password
POST /forgot-password     → Send reset link
GET  /reset-password      → Reset password form
POST /reset-password      → Reset password action
```

### **Super Admin Routes** (Role: owner)
```
GET  /admin/dashboard              → Super admin dashboard
GET  /admin/tenants                → Kelola semua tenant
POST /admin/tenants/{id}/toggle    → Toggle status tenant
DELETE /admin/tenants/{id}         → Hapus tenant
```

### **Tenant Admin Routes** (Role: admin)
```
GET  /dashboard                    → Dashboard toko
GET  /products                     → List produk
POST /products                     → Tambah produk
PUT  /products/{id}                → Update produk
DELETE /products/{id}              → Hapus produk

GET  /employees                    → List karyawan (Pro only)
POST /employees                    → Tambah karyawan (Pro only)
DELETE /employees/{id}             → Hapus karyawan (Pro only)

GET  /reports/profit-loss          → Laporan laba/rugi (Pro only)
GET  /reports/financial            → Laporan keuangan (Pro only)
GET  /reports/profit-loss/export-excel
GET  /reports/profit-loss/export-pdf
GET  /reports/financial/export-excel

GET  /activity-logs                → Log aktivitas (Pro only)

GET  /settings                     → Settings toko
POST /settings/update              → Update settings
```

### **POS & Transaction Routes** (Role: admin, cashier)
```
GET  /pos                          → Halaman kasir
POST /transaction/qris             → Generate QRIS dinamis
POST /transaction/store            → Simpan transaksi
GET  /transactions/history         → Riwayat transaksi
GET  /receipt/{invoice_code}       → Lihat struk
```

### **Error Routes**
```
GET  /akun/suspended               → Halaman toko suspended
GET  /akun/expired                 → Halaman subscription expired
```

---

## 🔧 Dependencies

### **Backend (composer.json)**
```json
{
  "laravel/framework": "^12.0",
  "inertiajs/inertia-laravel": "^2.0",
  "laravel/breeze": "^2.3",
  "tightenco/ziggy": "^2.0",
  "simplesoftwareio/simple-qrcode": "^4.2",
  "khanamiryan/qrcode-detector-decoder": "^2.0",
  "maatwebsite/excel": "^3.1",
  "barryvdh/laravel-dompdf": "^3.1"
}
```

**Key Libraries:**
- **Inertia.js** → SPA dengan Laravel + React
- **Breeze** → Authentication scaffolding
- **Ziggy** → Named routes di JavaScript
- **Simple QR Code** → Generate QR Code
- **QR Code Decoder** → Decode QRIS string
- **Maatwebsite Excel** → Export Excel
- **DomPDF** → Export PDF

### **Frontend (package.json)**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@inertiajs/react": "^2.0.0",
  "@headlessui/react": "^2.0.0",
  "tailwindcss": "^3.2.1",
  "framer-motion": "^12.26.1",
  "recharts": "^3.6.0",
  "sweetalert2": "^11.26.17",
  "jsqr": "^1.4.0"
}
```

**Key Libraries:**
- **React** → UI framework
- **Inertia React** → Adapter untuk Inertia.js
- **Headless UI** → Unstyled accessible components
- **TailwindCSS** → Utility-first CSS
- **Framer Motion** → Animasi
- **Recharts** → Chart library
- **SweetAlert2** → Beautiful alerts
- **jsQR** → QR Code scanner

---

## 🎨 Design System

### **Color Palette**
- Primary: Blue gradient (#3b82f6 → #1d4ed8)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Dark: Gray (#1f2937)

### **Typography**
- Font: System font stack (default)
- Heading: Bold, larger sizes
- Body: Regular, readable sizes

### **Components**
- Buttons: Primary, Secondary, Danger
- Inputs: Text, Number, Select, Checkbox
- Modals: Centered, backdrop blur
- Cards: Rounded, shadow
- Tables: Striped, hover effect

---

## 💾 Database Seeding

File: `database/seeders/DatabaseSeeder.php`

**Data Demo:**
1. **Super Admin (Owner)**
   - Email: `owner@pos.com`
   - Password: `password`
   - Role: `owner`

2. **Tenant 1: Kopi Senja & Logika (Cafe)**
   - Admin: `admin@kopi.com` / `password`
   - Kasir: `kasir@kopi.com` / `password`
   - Status: `active` (Pro Business)
   - Produk:
     - Es Kopi Susu Gula Aren (Rp 18.000)
     - Mie Goreng Coding (Rp 25.000)

3. **Tenant 2: Barbershop Ganteng (Jasa)**
   - Admin: `admin@barber.com` / `password`
   - Status: `trial`
   - Produk:
     - Gentleman Cut + Wash (Rp 50.000)

---

## 🔄 Business Logic Flow

### **1. Flow Transaksi**
```
1. Kasir login → Redirect ke /pos
2. Pilih produk → Masuk cart
3. Pilih metode pembayaran:
   - Cash → Input uang tunai
   - QRIS → Generate QR dinamis
4. Klik "Bayar"
5. Backend:
   - Validasi data
   - Buat transaksi (header)
   - Simpan detail item
   - Kurangi stok (jika managed)
   - Log aktivitas (jika Pro)
6. Redirect ke struk (/receipt/{invoice_code})
7. Kasir bisa print atau kembali ke POS
```

### **2. Flow Subscription Check**
```
1. User login
2. Middleware CheckStoreStatus:
   - Cek status tenant
   - Jika suspended → Redirect /akun/suspended
   - Jika expired → Redirect /akun/expired
3. Middleware CheckSubscription (untuk fitur Pro):
   - Cek status === 'active'
   - Jika trial → Redirect back dengan error
4. Akses fitur
```

### **3. Flow QRIS Dinamis**
```
1. Admin upload QRIS statis
2. Backend decode → Simpan raw string
3. Saat transaksi QRIS:
   - Frontend request ke /transaction/qris
   - Backend inject nominal ke raw string
   - Generate QR Code baru
   - Return SVG ke frontend
4. Customer scan → Bayar
```

---

## 🧪 Testing Credentials

| Role | Email | Password | Tenant |
|------|-------|----------|--------|
| Super Admin | owner@pos.com | password | - |
| Admin Cafe | admin@kopi.com | password | Kopi Senja (Pro) |
| Kasir Cafe | kasir@kopi.com | password | Kopi Senja (Pro) |
| Admin Barber | admin@barber.com | password | Barbershop (Trial) |

---

## 📝 Development Notes

### **Konvensi Kode:**
- Model: Singular, PascalCase (`User`, `Tenant`)
- Controller: Singular + Controller (`UserController`)
- Migration: Snake_case (`create_users_table`)
- Route name: Dot notation (`transaction.store`)
- View/Component: PascalCase (`Dashboard.jsx`)

### **Best Practices:**
- Selalu filter query dengan `tenant_id`
- Gunakan DB transaction untuk operasi kompleks
- Validasi input di backend
- Gunakan middleware untuk authorization
- Log aktivitas penting (Pro feature)

### **Security:**
- Password di-hash dengan bcrypt
- CSRF protection (Laravel default)
- SQL injection prevention (Eloquent ORM)
- XSS prevention (React auto-escape)
- Role-based access control

---

## 🚀 Deployment Checklist

- [ ] Set `APP_ENV=production` di `.env`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate app key: `php artisan key:generate`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed database: `php artisan db:seed`
- [ ] Build assets: `npm run build`
- [ ] Optimize: `php artisan optimize`
- [ ] Set proper file permissions
- [ ] Configure web server (Nginx/Apache)
- [ ] Setup SSL certificate
- [ ] Configure queue worker
- [ ] Setup backup system

---

## 📞 Support & Maintenance

### **Common Issues:**

**1. Error 500 saat akses halaman**
- Cek log: `storage/logs/laravel.log`
- Pastikan `.env` sudah benar
- Clear cache: `php artisan cache:clear`

**2. Transaksi tidak tersimpan**
- Cek database connection
- Cek validasi di controller
- Lihat error di console browser

**3. QRIS tidak generate**
- Pastikan tenant punya `qris_raw_string`
- Cek library SimpleSoftwareIO/simple-qrcode terinstall
- Validasi format string QRIS

**4. Subscription tidak bekerja**
- Cek middleware `CheckSubscription` terdaftar
- Cek `subscription_ends_at` di database
- Cek status tenant

---

## 🎯 Future Enhancements

### **Planned Features:**
- [ ] Payment gateway integration (Midtrans, Xendit)
- [ ] WhatsApp notification untuk struk
- [ ] Multi-currency support
- [ ] Inventory management (purchase order)
- [ ] Customer loyalty program
- [ ] Mobile app (React Native)
- [ ] API untuk integrasi eksternal
- [ ] Multi-language support
- [ ] Advanced analytics & insights
- [ ] Automated backup

---

**Last Updated:** 19 Januari 2026  
**Version:** 1.0.0  
**Maintainer:** Development Team
