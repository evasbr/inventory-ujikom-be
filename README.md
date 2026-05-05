# Inventory & Loan Management System (Backend)

Sistem manajemen inventaris barang dan peminjaman berbasis **NestJS** dengan **Drizzle ORM**. Backend ini menangani siklus hidup barang mulai dari pendaftaran, pemantauan status, hingga transaksi peminjaman dengan sistem persetujuan.

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL
- **Validation:** Class Validator & Transformer
- **Documentation:** Swagger UI (OpenAPI)
- **Testing:** Jest

## Fitur Utama

- **Inventory Management**: CRUD (Create, Read, Update, Delete) data barang.
- **Loan Tracking**: Alur peminjaman (Request -> Approve -> Return).
- **Search & Filter**: Pencarian barang berdasarkan nama dan status ketersediaan.
- **API Documentation**: Terintegrasi otomatis dengan Swagger.

---

## 📋 Prasyarat

- Node.js (v18 atau lebih tinggi)
- PostgreSQL
- npm atau yarn

## ⚙️ Instalasi

1.  **Clone Repositori**

    ```bash
    git clone <repository-url>
    cd backend-project
    ```

2.  **Install Dependensi**

````bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env` di root direktori:

```env
    DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
    PORT=3000
    ```

4.  **Migrasi Database**
    Gunakan Drizzle-kit untuk mendorong skema ke database:
    ```bash
    npx drizzle-kit push:pg
    ```

---

## 🏃 Menjalankan Aplikasi
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
````

Setelah berjalan, buka **`http://localhost:3000/api`** untuk melihat dokumentasi Swagger.

---

## 🧪 Testing

Aplikasi ini dilengkapi dengan unit test untuk memastikan logika bisnis berjalan benar (terutama pada bagian transaksi).

```bash
# Menjalankan semua test
npm test

# Menjalankan test dengan coverage
npm run test:cov
```

---

## 📂 Struktur Folder

```text
src/
├── database/
│   ├── schema.ts      # Definisi tabel (Inventory & Loans)
│   ├── db.module.ts   # Modul koneksi database global
│   └── db.provider.ts # Drizzle provider configuration
├── modules/
│   ├── inventory/     # Controller, Service, & DTO untuk barang
│   └── loans/         # Logika transaksi peminjaman & pengembalian
└── main.ts            # Entry point aplikasi
```
