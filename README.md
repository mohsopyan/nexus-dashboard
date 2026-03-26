# Nexus Dashboard 🚀
**The Intelligent Interface for Nexus-Bridge Ecosystem**

Nexus Dashboard adalah antarmuka admin berbasis **Next.js 15** yang dirancang untuk mengelola dan memvisualisasikan data dari **Nexus-Bridge** (Hybrid Node.js & Python AI Engine). Proyek ini merupakan bagian dari validasi branding sebagai *Hybrid Backend Engineer*.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn UI (Radix Nova Style)
- **Visualisasi:** Recharts (D3-based)
- **Language:** TypeScript
- **API Client:** Axios with Centralized Interceptors
- **Icons:** Lucide React

## 🏗 Architecture Note
Dashboard ini berfungsi sebagai **Consumer** dari API yang disediakan oleh [Nexus-Bridge](https://github.com/mohsopyan/nexus-bridge). Komunikasi dilakukan secara asinkron menggunakan JWT Authentication. Sistem ini dirancang untuk memantau performa Python AI Engine melalui Node.js Gateway.

## 🚀 Getting Started

### 1. Prerequisites
- Pastikan **Nexus-Bridge (Backend)** sudah berjalan di port `3000`.
- **PostgreSQL** Database aktif dengan data log yang sudah terisi.

### 2. Environment Setup
Salin template environment dan sesuaikan konfigurasinya:
```bash
cp .env.example .env.local
```
Isi ```NEXT_PUBLIC_API_URL``` dengan alamat backend Anda

### 3. Installation
```bash
npm install
```

### 4. Development
Jalankan dashboard di port ```3001``` (Untuk menghindari konflik dengan backend):
```bash
npm run dev
```

### 📊 Core Features
Dashboard ini menyediakan visualisasi data real-time yang ditarik langsung dari database melalui Nexus-Bridge:

- **AI Usage Metrics:** Melacak total query dan akumulasi karakter prompt yang diproses oleh AI Engine secara agregat.

- **User Analytics:** Menampilkan jumlah pengguna terdaftar yang tersinkronisasi dengan database PostgreSQL via Prisma.

- **Performance Monitoring (Latency):** Visualisasi presisi tinggi menggunakan ```performance.now()``` untuk mengukur Round Trip Time (RTT) antara Node.js Gateway dan Python AI Service.

- **Traffic Trend:** Grafik batang harian yang menunjukkan volume permintaan ke sistem AI.

### 📁 Project Structure
- **src/app**: Routing dan UI Pages.
- **src/components**: UI Components (Shadcn & Custom).
- **src/services**: API Client & Business Logic.
- **src/lib**: Utilities dan Helper functions.

### 🛡 Authentication
Sistem menggunakan JWT (JSON Web Token). Token disimpan secara aman di ```localStorage``` dan disisipkan secara otomatis ke setiap request melalui Axios Interceptor.

## 🐳 Docker Integration
Proyek ini dirancang untuk berjalan secara harmonis dalam ekosistem Docker. Dashboard dikonfigurasi untuk berkomunikasi dengan backend yang terisolasi di dalam container, memastikan konsistensi lingkungan pengembangan dan produksi.

Created with focus on Node.js & Python AI Integration.
