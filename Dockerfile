# ============================================
# KIDORA — Docker image (untuk Coolify / mana-mana PaaS)
# Satu image: build frontend (Vite) + backend Express yang serve
# static frontend (dist) + API + SPA fallback.
# ============================================

# ---- Peringkat 1: Build frontend ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Peringkat 2: Runtime (backend serve API + static) ----
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
WORKDIR /app/server
RUN npm ci --omit=dev
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/server.js"]
