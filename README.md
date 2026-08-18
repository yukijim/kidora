# KIDORA — Little Minds, Big Adventures 🧒✨

Platform pendidikan interaktif untuk kanak-kanak berumur **4–7 tahun**. Belajar, bermain, dan capai pencapaian bersama KIDORA The Explorer!

## Stack

- **Frontend** — React 19 + Vite, framer-motion, lucide-react, react-router-dom
- **Backend** — Express (Node.js), JWT auth, JSON disk-persistence
- **Deployment** — Docker + Coolify (auto-deploy via GitHub Actions)

## Struktur

| Direktori | Keterangan |
|-----------|------------|
| `src/` | Frontend React (halaman kanak-kanak, ibu bapa, landing) |
| `server/` | Backend Express API |
| `src/data/` | Data kurikulum & mock (dikongsi frontend + backend) |
| `deploy/` | Config deployment (Nginx, Traefik, PM2) |
| `.github/workflows/` | CI/CD (auto-deploy ke Coolify) |

## Pembangunan

```bash
# Frontend (dev server)
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## Build Production

```bash
npm run build        # bina frontend ke dist/
```

## Deploy

Deployment dikendalikan oleh **Coolify** (Docker). Setiap `git push` ke `master`
mencetuskan GitHub Actions yang memanggil Coolify untuk redeploy secara automatik.
