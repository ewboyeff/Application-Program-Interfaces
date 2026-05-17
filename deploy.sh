#!/bin/bash
# Digital Ocean deployment script
# Run once on the server: bash deploy.sh

set -e

echo "=== Museum API deployment ==="

# Pull latest code
git pull origin museum-api

# Install dependencies
npm install --production=false

# Build TypeScript
npm run build

# Restart app with PM2
if pm2 list | grep -q museum-api; then
  pm2 restart museum-api
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "=== Deploy complete ==="
pm2 status
