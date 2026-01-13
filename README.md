# 🏋️‍♂️ Work365 - NGACENG? PUSH UP! 🚀

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?style=for-the-badge&logo=google-maps)

**The Ultimate Fitness & Transformation Tracking App with "Liquid Glass" Visuals**

[Demo](#demo) • [Fitur](#fitur) • [Teknologi](#teknologi) • [Instalasi](#instalasi) • [Kontributor](#kontributor)

</div>

---

## 📖 Tentang

**Work365** adalah aplikasi navigasi transformasi fisik komprehensif yang dirancang untuk menemani perjalanan 365 hari Anda menuju versi terbaik diri. Dibangun dengan antarmuka modern bergaya *Liquid Glass UI*, aplikasi ini menggabungkan pelacakan latihan, nutrisi cerdas berbasis AI, dan pemantauan aktivitas lari real-time.

---

## ✨ Fitur

### 📸 AI Food Vision (Premium)
- Scan makanan menggunakan kamera untuk deteksi nutrisi instan.
- Menggunakan Google Cloud Vision untuk akurasi tinggi.
- Otomatis menghitung Kalori, Protein, Karbo, dan Lemak.

### 🏃‍♂️ Real-time GPS Run Tracker
- Lacak rute lari secara live di Google Map.
- Monitoring Pace per Km, Jarak, Elevasi, dan Kalori terbakar.
- Riwayat aktivitas lari lengkap dengan grafik performa.

### ✍️ AI Text Shortcut
- Shortcut pencatatan nutrisi lewat teks (Contoh: "2 telur rebus dan nasi putih").
- Analisis teks instan untuk kalkulasi makro nutrisi tanpa ribet.

### ⏱️ Workout Timer & Logs
- Timer interval untuk latihan intensitas tinggi.
- Visualisasi progress latihan harian.

### � Program Roadmap 365
- Timeline visual perjalanan transformasi dari Day 1 - Day 365.
- Tracking progres harian dalam satu dashboard premium.

### � Profil & Biometrik
- Kalkulasi otomatis BMR dan TDEE.
- Manajemen data personal (Berat, Tinggi, Umur, Aktivitas).

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16.1 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Database** | PostgreSQL (Supabase) |
| **AI Processing** | Google Cloud Vision API |
| **Mapping** | Google Maps SDK for React |
| **State Management** | Zustand |
| **Animasi** | Framer Motion |
| **Ikon** | Lucide React |
| **Charts** | Recharts |

---

## 🚀 Instalasi

### Prasyarat
- Node.js 18+ 
- Akun Supabase (Database & Auth)
- Google Maps API Key (With Vision API enabled)

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/BryanAlexanderSantoso/Work365.git
   cd Work365
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env.local` di root folder:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_KEY"
   ```

4. **Sinkronisasi database**
   Copy isi dari `schema.sql` ke SQL Editor di dashboard Supabase Anda dan jalankan.

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## �️ Struktur Folder

```
Work365/
├── public/                # Static assets (Icons, Images)
├── src/
│   ├── app/               # Next.js App Router (Dashboard, Run, Nutrition)
│   ├── components/        # React components (UI & Layout)
│   ├── contexts/          # Auth Context provider
│   ├── lib/               # Utilities (Gemini Vision, Supabase Client)
│   └── stores/            # Zustand state management
├── schema.sql             # Database schema for Supabase
├── next.config.ts         # App configuration
└── package.json
```

---

## 👨‍💻 Kontributor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/BryanAlexanderSantoso">
        <img src="https://github.com/BryanAlexanderSantoso.png" width="100px;" alt="Bryan Alexander Santoso"/>
        <br />
        <sub><b>Bryan Alexander Santoso</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ in Indonesia**

⭐ Jangan lupa kasih bintang kalau suka! ⭐

</div>
