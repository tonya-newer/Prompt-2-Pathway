#!/bin/bash
# Stop on first error
set -e

cd /var/www/Prompt-2-Pathway

git reset --hard
git pull origin main

npm install
npm run build

cd //var/www/Prompt-2-Pathway/server

npm install
pm2 restart prompt-2-pathway-server || pm2 start server.js --name prompt-2-pathway-server

echo "Deployment finished!"
