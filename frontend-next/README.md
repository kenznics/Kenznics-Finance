# 💰 Kenznics Finance - Full-Stack Real-Time Financial Tracker

[![Next.js Version](https://shields.io)](https://nextjs.org)
[![Prisma Version](https://shields.io)](https://prisma.io)
[![Database](https://shields.io)](https://neon.tech)
[![State Management](https://shields.io)](https://tanstack.com)

**Kenznics Finance** adalah aplikasi manajemen keuangan personal berbasis web yang dibangun secara *full-stack* menggunakan arsitektur modern Next.js App Router. Aplikasi ini memungkinkan pengguna untuk mencatat pemasukan dan pengeluaran secara riil, memantau rincian aktivitas, serta melihat akumulasi saldo berjalan (*running balance*) secara instan tanpa perlu memuat ulang halaman browser (*zero-refresh*).

---

## ✨ Fitur Utama Application

*   **🔒 Sistem Autentikasi Native Server-Side**: Mengelola pendaftaran akun (`/register`) dan log masuk (`/login`) dari nol menggunakan enkripsi keamanan `bcryptjs` dan sesi token JWT yang diamankan di dalam kuki `HttpOnly` untuk proteksi tingkat tinggi dari serangan XSS.
*   **🛡️ Satpam Rute Dua Arah (Global Proxy Guard)**: Menggunakan fitur native Next.js 16+ Edge Runtime `src/proxy.ts` untuk mengunci rute privat (`/dashboard`, `/history`, `/input`) dari pengguna anonim, sekaligus otomatis mengusir pengguna aktif dari halaman login/register.
*   **🌀 Sinkronisasi State Klien Reaktif**: Navigasi utama (`Navbar.tsx`) memanfaatkan gabungan React Context API dan TanStack Query yang otomatis memperbarui informasi profil email user secara *real-time* dan *asynchronous* saat terjadi pergantian akun.
*   **💹 Perhitungan Saldo Berjalan Otomatis**: Mengoptimalkan fungsi `.reduce()` dan `useMemo` di sisi klien untuk menghitung riwayat saldo akhir secara kronologis berdasarkan parameter tanggal `createAt` langsung dari database cloud.
*   **🛠️ Penanganan Rute Liar Aman (Infinite-Loop Protection)**: Menjinakkan kesalahan halaman 404 (`not-found.tsx`) menggunakan metode native pengalihan siklus `window.location.href` guna menghentikan *crash rendering* berulang pada browser.

---

## 🛠️ Tech Stack & Arsitektur Sistem

### Frontend & UI Engine
*   **Framework**: Next.js 16+ (App Router Architecture, Client & Server Components Separation)
*   **Styling**: Tailwind CSS (Utility-First, Responsive Design, Micro-interactions)
*   **Form Management**: React Hook Form & Zod Schema Validation (Strict client-side restriction)
*   **Data Caching & Mutations**: TanStack Query v5 (React Query)

### Backend & Database Layer
*   **Server Runtime**: Next.js Native Route Handlers (Edge & Node.js Environment)
*   **Database ORM**: Prisma ORM v7 (Optimized Adapter-pg Client)
*   **Database Cloud Hosting**: Neon Serverless PostgreSQL (Cloud-native database pooling)
*   **Security Protocol**: JSON Web Token (JWT) & Server-side `HttpOnly` Cookies Store

---

## 📊 Skema Database Prisma (Relasional)

Aplikasi ini menggunakan struktur pangkalan data relasional *One-to-Many* yang menghubungkan tabel identitas pengguna dengan tabel mutasi transaksi finansial:

```prisma
model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  password     String
  createdAt    DateTime      @default(now())
  transactions Transaction[]
}

model Transaction {
  id        Int      @id @default(autoincrement())
  title     String
  amount    Float
  type      String   // INCOME atau EXPENSE
  createAt  DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

1. **Klon Repositori**
   ```bash
   git clone https://github.com
   cd kenznics-finance
   ```

2. **Instalasi Dependensi Modul**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables (`.env`)**
   Buat sebuah file baru bernama `.env` di direktori utama, lalu lengkapi variabel berikut:
   ```env
   # Koneksi String Database Cloud Neon Anda
   DATABASE_URL="postgresql://user:password@neon-cloud-host/dbname?sslmode=require"
   
   # Kunci Rahasia JWT Token Enkripsi
   JWT_SECRET="KenzNik500."
   ```

4. **Sinkronisasi Skema Prisma Migrations**
   ```bash
   npx prisma db push
   ```

5. **Jalankan Server Pengembangan Lokal**
   ```bash
   npm run dev
   ```
   Buka alamat [http://localhost:3001](http://localhost:3001) pada browser Anda untuk melihat aplikasi berjalan.

---

## 👨‍💻 Kontributor & Pengembang

*   **Kenznics** - *Full-Stack Engineer / Creator* - [@github-username](https://github.com)

---
Developed with using Next.js, Prisma, and Cloud Neon.
