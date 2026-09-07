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
- Landing page → pilih pakej → isi nama/emel/telefon → hantar pesanan
- Pelanggan dibawa terus ke halaman bayaran **Bayarcash** (FPX, DuitNow, e-wallet, kad)
- Bayarcash hantar callback ke server bila bayaran berjaya → sistem **jana kod akses** secara automatik
- Muka "Terima Kasih" polling status pesanan & papar kod akses sejurus disahkan
- Ibu bapa masukkan kod → permainan terbuka

### Pakej harga
| Pakej | Harga | Akses |
|-------|-------|-------|
| Asas | RM 9.90 | 1 permainan (Kenal Huruf) |
| Lengkap ⭐ | RM 19.90 | Ketiga-tiga permainan |
| Keluarga | RM 29.90 | Ketiga-tiga + 3 kod akses |

## Stack

- **Frontend** — React 19 + Vite (React Router)
- **Backend** — Express (Node.js): serve static + API pesanan & kod akses (JSON disk-persistence)
- **Bayaran** — [Bayarcash](https://bayar.cash) (gateway pihak ketiga — FPX, DuitNow, e-wallet, kad), dengan panel admin manual sebagai alat sokongan/fallback
- **Deployment** — Docker + Coolify (auto-deploy via GitHub Actions)

## Struktur

| Direktori | Keterangan |
|-----------|------------|
| `src/` | Frontend React (landing, gerbang kod akses, panel admin, 3 permainan) |
| `src/data/games.js` | Data permainan & pakej |
| `src/pages/Admin/` | Panel admin dalaman — semak & sahkan pesanan secara manual (`/admin-kidora`) |
| `server/` | Backend Express (API + serve static) |
| `server/src/bayarcash.js` | Klien API Bayarcash (payment intent, checksum, pengesahan callback) |
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
# → isi BAYARCASH_PAT, BAYARCASH_SECRET_KEY, BAYARCASH_PORTAL_KEY (dari console.bayarcash-sandbox.com untuk testing)
# → isi ADMIN_KEY untuk panel /admin-kidora

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
BASE_URL=https://kidora.com.my
BAYARCASH_PAT=<Personal Access Token dari console Bayarcash>
BAYARCASH_SECRET_KEY=<API Secret Key dari console Bayarcash>
BAYARCASH_PORTAL_KEY=<Portal Key dari console Bayarcash>
BAYARCASH_SANDBOX=false
ADMIN_KEY=<phrase rawak panjang — untuk panel admin manual>
PORT=5000
```

> `server/.env` hanya untuk pembangunan setempat (gitignored). Production guna env vars Coolify.
> Sahkan dahulu dalam mod `BAYARCASH_SANDBOX=true` sebelum tukar ke `false` untuk bayaran sebenar.

## Panggilan API utama

| Endpoint | Keterangan |
|----------|------------|
| `GET /api/packages` | Senarai pakej harga |
| `POST /api/order` | Cipta pesanan + payment intent Bayarcash, pulangkan URL bayaran |
| `GET /api/order/:id` | Status pesanan (polling muka terima kasih) |
| `POST /api/bayarcash/callback` | (Bayarcash) Callback server-to-server bila status bayaran berubah |
| `POST /api/validate-code` | Semak kod akses |
| `POST /api/recover-code` | Dapatkan semula kod akses (lupa kod) |
| `GET /api/admin/orders` | (Admin, header `x-admin-key`) Senarai semua pesanan |
| `POST /api/admin/confirm/:id` | (Admin) Sahkan bayaran pesanan sedia ada secara manual → jana kod |
| `POST /api/admin/issue` | (Admin) Jana kod manual tanpa pesanan sedia ada |

## Panel Admin

Panel `/admin-kidora` adalah alat **sokongan/fallback manual** — untuk kes bayaran Bayarcash
tidak berjaya disahkan secara automatik (cth. callback gagal sampai). Buka
`https://kidora.com.my/admin-kidora`, masukkan `ADMIN_KEY`, semak senarai pesanan
yang menunggu pengesahan, dan klik **"Sahkan Bayaran"** untuk jana kod secara manual.
