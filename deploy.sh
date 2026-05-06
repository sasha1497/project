#!/bin/bash

# ==============================
# CONFIG
# ==============================
# KEY_PATH="bajol.pem"
KEY_PATH="/Users/sasha97/Documents/bajol.pem"
USER="ubuntu"
HOST="ec2-13-233-143-91.ap-south-1.compute.amazonaws.com"

LOCAL_BUILD_PATH="/Users/sasha97/Documents/matrimony/project/frontend/matrimony/build"
REMOTE_TMP_PATH="/home/ubuntu/frontend"
REMOTE_DEPLOY_PATH="/var/www/html"

# ==============================
# STEP 1: BUILD (optional)
# ==============================
echo "📦 Building project..."
cd "$LOCAL_BUILD_PATH/.." || exit
npm run build

# ==============================
# STEP 2: COPY FILES TO SERVER
# ==============================
echo "🚀 Uploading files to server..."
scp -i "$KEY_PATH" -r "$LOCAL_BUILD_PATH"/* $USER@$HOST:$REMOTE_TMP_PATH/

# ==============================
# STEP 3: SSH & DEPLOY
# ==============================
echo "🔧 Deploying on server..."

ssh -i "$KEY_PATH" $USER@$HOST << EOF

echo "🧹 تنظيف old files..."
sudo rm -rf $REMOTE_DEPLOY_PATH/*

echo "📁 Copying new build..."
sudo cp -r $REMOTE_TMP_PATH/* $REMOTE_DEPLOY_PATH/

echo "🔁 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment completed!"

EOF

echo "🎉 Done!"
