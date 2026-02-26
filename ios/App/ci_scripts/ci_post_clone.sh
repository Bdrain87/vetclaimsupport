#!/bin/sh
set -eo pipefail

# Build number is managed in project.pbxproj (CURRENT_PROJECT_VERSION) and
# read by Info.plist via $(CURRENT_PROJECT_VERSION). No auto-increment here —
# all bumps happen via manual commits to avoid conflicts with App Store Connect.

echo "=== [1/4] Ensuring Node.js is available ==="
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

echo "=== [2/4] Installing npm dependencies ==="
npm ci --prefer-offline || npm ci

echo "=== [3/4] Building web app ==="
npm run build

echo "=== [4/4] Syncing Capacitor iOS project ==="
npx cap sync ios

echo "=== Capacitor: iOS project ready for archive ==="
