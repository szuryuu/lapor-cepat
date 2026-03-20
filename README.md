# 🚨 LaporCepat — Sistem Pelaporan Darurat Bencana Berbasis AI

> Portal warga × Pusat Komando BPBD, dihubungkan oleh kecerdasan buatan secara real-time.

**Live Demo:** [lapor-cepat.vercel.app](https://lapor-cepat.vercel.app)

---

## Latar Belakang

Indonesia adalah negara kedua paling rawan bencana di dunia dengan skor kerentanan 43,5%. Namun sistem pelaporan darurat yang ada masih bergantung pada telepon manual ke call center — lambat, rawan miskomunikasi, dan tidak terstruktur.

**LaporCepat** hadir untuk menjawab satu pertanyaan: *bagaimana warga yang panik bisa menyampaikan situasi darurat secara akurat ke tim respons, secepat mungkin?*

---

## Solusi: AI Triage Pipeline

Warga tidak perlu mengisi formulir. Mereka cukup **berbicara** — dan AI mengerjakan sisanya.

```
[Suara Warga] → [Whisper STT] → [Gemini LLM Triage] → [Dashboard BPBD]
     ↓                                    ↓
[Foto Lokasi]                    Ekstraksi otomatis:
[GPS Koordinat]                  • Jenis bencana
                                 • Estimasi korban
                                 • Tingkat prioritas (CRITICAL/HIGH/MEDIUM/LOW)
                                 • Instruksi survival untuk korban
                                 • Deteksi hoax
```

---

## Fitur Utama

**Portal Warga (`/lapor`)**
- Perekaman suara langsung di browser, transkripsi via Whisper Large V3
- Mode teks (bisu) untuk situasi yang tidak memungkinkan bicara
- GPS otomatis dengan fallback ke IP geolocation
- Upload foto kondisi lapangan
- Halaman konfirmasi dengan preview hasil analisis AI sebelum dikirim
- Halaman pelacakan status evakuasi via ID laporan

**Dashboard BPBD (`/dashboard`)**
- Antrean triage real-time via Server-Sent Events (Firestore `onSnapshot`)
- Alert audio otomatis saat laporan kritis baru masuk
- Filter status: Menunggu / Diproses / Selesai
- Peta spasial interaktif (Leaflet) dengan filter prioritas
- Detail laporan lengkap: transkripsi AI, foto, koordinat, kontak pelapor
- Tindakan komando: tugaskan TRC, tandai selesai

---

## Arsitektur Teknis

| Layer | Teknologi |
|-------|-----------|
| Frontend | Nuxt 4, Vue 3, Tailwind CSS |
| AI — Speech-to-Text | Groq Whisper Large V3 |
| AI — Triage & Analisis | Google Gemini 2.5 Flash |
| Database | Firebase Firestore |
| Realtime | Server-Sent Events + Firestore onSnapshot |
| Geolokasi | Browser GPS API + IP Geolocation fallback |
| Peta | Leaflet.js + OpenStreetMap (CartoDB) |
| Deployment | Vercel (Serverless Node.js) |

---

## Cara Kerja (Demo Flow)

1. Buka `/lapor` → izinkan akses GPS dan mikrofon
2. Tekan **TAP & MULAI BICARA**, laporkan situasi darurat secara verbal
3. AI memproses suara → ekstrak lokasi, jenis bencana, jumlah korban
4. Review hasil analisis AI di halaman konfirmasi
5. Kirim → laporan masuk ke dashboard BPBD secara real-time
6. Operator BPBD melihat laporan di `/dashboard`, tugaskan TRC
7. Warga memantau status di `/status/[id]`

---

## Setup Lokal

```bash
# Clone & install
git clone https://github.com/szuryuu/lapor-cepat
cd lapor-cepat
npm install

# Setup environment
cp .env.example .env
# Isi semua variabel di .env

# Jalankan dev server
npm run dev
```

### Environment Variables

```env
BPBD_PIN=              # PIN login dashboard operator
GROQ_API_KEY=          # Groq API (Whisper STT)
GEMINI_API_KEY=        # Google Gemini API
FIREBASE_SERVICE_ACCOUNT= # JSON service account Firebase (stringify)

NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Keamanan

- Rate limiting per IP via Firestore (3 request/menit)
- Validasi tipe & ukuran file (audio maks 5MB, foto maks 10MB)
- Autentikasi dashboard via PIN + cookie session
- Input sanitization sebelum dikirim ke LLM (XML escaping)
- Laporan masuk sebagai `DRAFT` → hanya aktif setelah dikonfirmasi warga

---
