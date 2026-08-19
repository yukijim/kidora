# KIDORA — Belajar Sambil Main 🦁✨

Platform permainan pendidikan **Bahasa Melayu** untuk kanak-kanak berumur **3–6 tahun**.
Anak kenal huruf, mengira nombor & mengasah ingatan melalui permainan yang berwarna-warni.

## Produk

| # | Permainan | Belajar |
|---|-----------|---------|
| 1 | **Kenal Huruf ABC** 🔤 | Huruf A–Z, bunyi & perkataan |
| 2 | **Mari Mengira** 🔢 | Nombor 1–10 |
| 3 | **Padankan Gambar** 🃏 | Ingatan & pengecaman |

### Model jualan
- Landing page → pilih pakej → bayar online (**BizApp Pay**: FPX / eWallet / kad)
- Bayaran berjaya → sistem **jana kod akses automatik**
- Ibu bapa masukkan kod → permainan terbuka

### Pakej harga
| Pakej | Harga | Akses |
|-------|-------|-------|
| Asas | RM 9.90 | 1 permainan (Kenal Huruf) |
| Lengkap ⭐ | RM 19.90 | Ketiga-tiga permainan |
| Keluarga | RM 29.90 | Ketiga-tiga + 3 kod akses |

## Stack

- **Frontend** — React 19 + Vite (React Router)
- **Backend** — Express (Node.js): serve static + API bayaran & kod akses (JSON disk-persistence)
- **Bayaran** — BizApp Pay API V3 (create bill + callback webhook)
- **Deployment** — Docker + Coolify (auto-deploy via GitHub Actions)

## Struktur

| Direktori | Keterangan |
|-----------|------------|
| `src/` | Frontend React (landing, gerbang kod akses, 3 permainan) |
| `src/data/games.js` | Data permainan & pakej |
| `server/` | Backend Express (API + serve static) |
| `server/src/bizappay.js` | Klien BizApp Pay V3 |
| `server/src/store.js` | JSON persistence (pesanan & kod) |
| `deploy/` | Config deployment (Nginx, Traefik, PM2) |
| `.github/workflows/` | CI/CD (auto-deploy ke Coolify) |

## Pembangunan (local)

```bash
# 1. Pasang dependensi frontend
npm install

# 2. Pasang dependensi backend
cd server
npm install
cd ..

# 3. Sediakan konfigurasi backend
cp server/.env.example server/.env
# → isi BIZAPPAY_API_KEY, BIZAPPAY_CATEGORY, BASE_URL dalam server/.env

# 4. Jalankan backend (terminal 1)
cd server && npm run dev

# 5. Jalankan frontend (terminal 2)
npm run dev
```

Buka http://localhost:5173 — API `/api/*` diproxy ke backend port 5000.

## Build Production

```bash
npm run build        # bina frontend ke dist/
```

## Deploy (Coolify)

Deployment dikendalikan oleh **Coolify** (Docker). Setiap `git push` ke `master`
mencetuskan GitHub Actions yang memanggil Coolify untuk redeploy automatik.

Dalam Coolify, tetapkan **environment variables** berikut untuk aplikasi:

```
BIZAPPAY_API_KEY=<api key anda>
BIZAPPAY_CATEGORY=<kod kategori>
BASE_URL=https://kidora.com.my
PORT=5000
```

> `server/.env` hanya untuk pembangunan setempat (gitignored). Production guna env vars Coolify.

## Panggilan API utama

| Endpoint | Keterangan |
|----------|------------|
| `GET /api/packages` | Senarai pakej harga |
| `POST /api/order` | Cipta bil BizApp Pay → return URL bayaran |
| `GET/POST /api/bizappay/callback` | Webhook BizApp Pay (bayaran berjaya → jana kod) |
| `GET /api/order/:id` | Status pesanan (polling muka terima kasih) |
| `POST /api/validate-code` | Semak kod akses |
| `POST /api/admin/issue` | (Pilihan) jana kod manual — aktif bila `ADMIN_KEY` ditetapkan |
