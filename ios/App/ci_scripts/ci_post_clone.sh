#!/bin/sh
set -e

echo "=== Auto-incrementing build number ==="
if [ -n "$CI_BUILD_NUMBER" ]; then
  echo "Setting build number to Xcode Cloud CI_BUILD_NUMBER: $CI_BUILD_NUMBER"
  cd "$CI_PRIMARY_REPOSITORY_PATH/ios/App"
  agvtool new-version -all "$CI_BUILD_NUMBER"
  cd "$CI_PRIMARY_REPOSITORY_PATH"
else
  echo "Not running in Xcode Cloud, skipping build number increment"
fi

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
