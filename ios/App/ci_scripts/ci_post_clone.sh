#!/bin/sh
set -eo pipefail

echo "=== [1/5] Auto-incrementing build number ==="
if [ -n "$CI_BUILD_NUMBER" ]; then
  echo "Setting build number to Xcode Cloud CI_BUILD_NUMBER: $CI_BUILD_NUMBER"
  cd "$CI_PRIMARY_REPOSITORY_PATH/ios/App"
  agvtool new-version -all "$CI_BUILD_NUMBER"
  cd "$CI_PRIMARY_REPOSITORY_PATH"
else
  echo "Not running in Xcode Cloud, skipping build number increment"
fi

echo "=== [2/5] Ensuring Node.js is available ==="
if command -v node > /dev/null 2>&1; then
  echo "Node.js already available: $(node --version)"
else
  echo "Node.js not found, installing via Homebrew..."
  export HOMEBREW_NO_AUTO_UPDATE=1
  export HOMEBREW_NO_INSTALL_CLEANUP=1
  brew install node
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "=== [3/5] Installing npm dependencies ==="
npm ci --prefer-offline || npm ci

echo "=== [4/5] Building web app ==="
npm run build

echo "=== [5/5] Syncing Capacitor iOS project ==="
npx cap sync ios

echo "=== Capacitor: iOS project ready for archive ==="
