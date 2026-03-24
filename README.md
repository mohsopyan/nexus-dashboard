# Nexus Dashboard 🚀
**The Intelligent Interface for Nexus-Bridge Ecosystem**

Nexus Dashboard adalah antarmuka admin berbasis **Next.js 15** yang dirancang untuk mengelola dan memvisualisasikan data dari **Nexus-Bridge** (Hybrid Node.js & Python AI Engine). Proyek ini merupakan bagian dari validasi branding sebagai *Hybrid Backend Engineer*.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn UI (Radix Nova Style)
- **Language:** TypeScript
- **API Client:** Axios with Centralized Interceptors
- **Icons:** Lucide React

## 🏗 Architecture Note
Dashboard ini berfungsi sebagai **Consumer** dari API yang disediakan oleh [Nexus-Bridge](https://github.com/mohsopyan/nexus-bridge). Komunikasi dilakukan secara asinkron menggunakan JWT Authentication.

## 🚀 Getting Started

### 1. Prerequisites
Pastikan **Nexus-Bridge (Backend)** sudah berjalan di port `3000`.

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

### 📁 Project Structure
- **src/app**: Routing dan UI Pages.
- **src/components**: UI Components (Shadcn & Custom).
- **src/services**: API Client & Business Logic.
- **src/lib**: Utilities dan Helper functions.

### 🛡 Authentication
Sistem menggunakan JWT (JSON Web Token). Token disimpan secara aman di ```localStorage``` dan disisipkan secara otomatis ke setiap request melalui Axios Interceptor.

### 📊 Monitoring Features
Dashboard ini meneyediakan visualisasi data real-time yang ditarik langsung dari database melalui Nexus-Bridge:
- **AI Usage Metrics:** Melacak total query dan akumulasi karakter prompt yang di proses oleh AI Engine.
**User Analytics:** Menampilkan jumlah pengguna terdaftar yang tersinkronisasi dengan database PostgreSQL via Prisma.
- **System Performance:** Monitoring tren trafik dan latensi sistem (Data-centric visualization).

## 🐳 Docker Integration
Proyek ini dirancang untuk berjalan secara harmonis dalam ekosistem Docker. Dashboard dikonfigurasi untuk berkomunikasi dengan backend yang terisolasi di dalam container, memastikan konsistensi lingkungan pengembangan dan produksi.

Created with focus on Node.js & Python AI Integration.
