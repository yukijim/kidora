#!/usr/bin/env bash
# ============================================
# KIDORA — Skrip setup server (jalankan SEKALI di VPS sebagai root)
# Pasang: Node.js 22, Nginx, PM2, Certbot + sediakan direktori app
#
# Guna:  ssh root@VPS_IP 'bash -s' < deploy/setup-server.sh
# ============================================
set -euo pipefail

echo "== KIDORA Server Setup =="

# 1. Kemas kini sistem
apt-get update -y
apt-get upgrade -y

# 2. Pasang Node.js 22 LTS (NodeSource)
if ! command -v node >/dev/null 2>&1; then
  echo ">> Pasang Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
else
  echo ">> Node.js sedia ada: $(node -v)"
fi

# 3. Pasang Nginx
echo ">> Pasang Nginx..."
apt-get install -y nginx

# 4. Pasang PM2 (global)
if ! command -v pm2 >/dev/null 2>&1; then
  echo ">> Pasang PM2..."
  npm install -g pm2
else
  echo ">> PM2 sedia ada: $(pm2 -v)"
fi

# 5. Pasang Certbot (Let's Encrypt SSL)
echo ">> Pasang Certbot..."
apt-get install -y certbot python3-certbot-nginx

# 6. Sediakan direktori app
mkdir -p /var/www/kidora/server/data /var/www/kidora/dist

echo ""
echo "== Setup SELESAI =="
node -v
nginx -v
pm2 -v
echo "Direktori app: /var/www/kidora/{server,dist}"
