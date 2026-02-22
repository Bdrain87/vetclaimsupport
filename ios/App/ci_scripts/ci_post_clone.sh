#!/bin/sh

set -e

echo "=== Capacitor: Installing Node.js dependencies and building web app ==="

if ! command -v node > /dev/null 2>&1; then
  echo "Node.js not found, installing via Homebrew..."
  brew install node
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "Installing npm dependencies..."
npm ci

echo "Building web app..."
npm run build

echo "Syncing Capacitor iOS project..."
npx cap sync ios

echo "=== Capacitor: iOS project ready for archive ==="
