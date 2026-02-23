#!/bin/sh
set -eo pipefail

echo "=== [1/5] Auto-incrementing build number ==="
if [ -n "$CI_BUILD_NUMBER" ]; then
  cd "$CI_PRIMARY_REPOSITORY_PATH/ios/App"
  # Use whichever is higher: Xcode Cloud's CI_BUILD_NUMBER or the repo's current value.
  # This prevents failures when manual uploads have pushed the number past CI's counter.
  REPO_BUILD=$(agvtool what-version -terse 2>/dev/null || echo "0")
  if [ "$CI_BUILD_NUMBER" -gt "$REPO_BUILD" ] 2>/dev/null; then
    BUILD_NUM="$CI_BUILD_NUMBER"
  else
    BUILD_NUM=$((REPO_BUILD + 1))
  fi
  echo "Setting build number to $BUILD_NUM (CI=$CI_BUILD_NUMBER, repo=$REPO_BUILD)"
  agvtool new-version -all "$BUILD_NUM"
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
