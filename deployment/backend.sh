#!/bin/bash

set -e  # Exit on any error

# === Node.js Version Check ===
if ! node -v | grep -q '^v20'; then
  echo "❌ Node.js v20 is required. Current: $(node -v)"
  exit 1
fi
echo "✅ Node.js version is $(node -v)"

# === Path Setup ===
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_ROOT="$BASE_DIR/project/backend/nest-js"

REMOTE_USER="ubuntu"
REMOTE_HOST="ec2-13-234-48-209.ap-south-1.compute.amazonaws.com"
REMOTE_DIR="/home/ubuntu/application"

# === SSH Key Path ===
KEY_PATH="$BASE_DIR/project/pem/bajol.pem"

if [ ! -f "$KEY_PATH" ]; then
  echo "❌ SSH key not found at $KEY_PATH"
  echo "📂 Contents of pem/ directory:"
  ls -l "$BASE_DIR/project/pem" || echo "pem directory not found"
  exit 1
fi

chmod 600 "$KEY_PATH"
echo "✅ Using SSH key: $KEY_PATH"

# === Temporary deploy folder ===
TMP_DEPLOY_DIR="$PROJECT_ROOT/tmp-deploy"

# === Cleanup function to run on script exit ===
cleanup() {
  if [ -d "$TMP_DEPLOY_DIR" ]; then
    echo "🧹 Cleaning up local tmp-deploy folder..."
    rm -rf "$TMP_DEPLOY_DIR"
  fi
}
trap cleanup EXIT

# === Navigate to NestJS Project ===
cd "$PROJECT_ROOT" || { echo "❌ Could not cd to $PROJECT_ROOT"; exit 1; }

# === Install dependencies ===
echo "📦 Installing dependencies..."
npm install --force || { echo "❌ npm install failed"; exit 1; }

# === List of NestJS Applications ===
APPS=("user" "auth")

# === Prepare Temporary Folder ===
rm -rf "$TMP_DEPLOY_DIR"
mkdir -p "$TMP_DEPLOY_DIR"

# === Build and Collect ===
for APP in "${APPS[@]}"; do
  echo "🔨 Building app: $APP..."
  npx nest build "$APP" || { echo "❌ Build failed for $APP"; exit 1; }

  APP_DIST="$PROJECT_ROOT/dist/apps/$APP/main.js"
  if [ ! -f "$APP_DIST" ]; then
    echo "❌ main.js not found for $APP"
    exit 1
  fi

  cp "$APP_DIST" "$TMP_DEPLOY_DIR/$APP.js"
done

# === Deploy Without Deleting Remote node_modules ===
echo "🚀 Deploying to $REMOTE_HOST (preserving node_modules)..."

if [ -z "$(ls -A "$TMP_DEPLOY_DIR")" ]; then
  echo "❌ Nothing to deploy. tmp-deploy is empty!"
  exit 1
fi

echo "📂 Files being deployed:"
ls -l "$TMP_DEPLOY_DIR"

rsync -avz \
  -e "ssh -i $KEY_PATH" \
  --exclude "node_modules" \
  "$TMP_DEPLOY_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# === Restart PM2 Apps ===
echo "🔄 Restarting PM2 apps on remote server..."
ssh -i "$KEY_PATH" "$REMOTE_USER@$REMOTE_HOST" << EOF
  cd $REMOTE_DIR
  pm2 restart user || pm2 start user.js --name user
  pm2 restart auth || pm2 start auth.js --name auth
  pm2 save
EOF

echo "✅ Deployment complete! Apps synced & PM2 restarted."
